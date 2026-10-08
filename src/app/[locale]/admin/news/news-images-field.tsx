"use client";

import {
  type DragEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import type { NewsImageValue } from "@/lib/news-fields";
import {
  NEWS_IMAGE_ACCEPT,
  pickNewsImages,
  type NewsImageErrorKey,
  type NewsImagePickRejection,
} from "@/lib/news-image";
import {
  deleteNewsImage,
  moveNewsImage,
  uploadNewsImage,
} from "./actions";

type GalleryItem = {
  key: string;
  id?: string;
  url: string;
  previewUrl: string;
  uploading: boolean;
  errorKey?: NewsImageErrorKey;
  file?: File;
};

function toItems(images: NewsImageValue[]): GalleryItem[] {
  return images
    .filter((image) => image.url)
    .map((image, index) => ({
      key: image.id ?? `existing-${index}-${image.url}`,
      id: image.id,
      url: image.url,
      previewUrl: image.url,
      uploading: false,
    }));
}

export function NewsImagesField({
  articleId,
  initialImages,
  onUploadingChange,
}: {
  articleId?: string;
  initialImages: NewsImageValue[];
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const t = useTranslations("admin.form");
  const errors = useTranslations("admin.errors");
  const labelId = useId();
  const hintId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCount = useRef(0);
  const inFlight = useRef(0);
  const objectUrls = useRef(new Set<string>());
  const [items, setItems] = useState<GalleryItem[]>(() => toItems(initialImages));
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [batchErrors, setBatchErrors] = useState<NewsImagePickRejection[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      for (const url of urls) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  const coverUrl = items.find((item) => item.url)?.url ?? "";
  const galleryUrls = items.filter((item) => item.url).map((item) => item.url);

  function setUploadingState(value: boolean) {
    setUploading(value);
    onUploadingChange?.(value);
  }

  function trackObjectUrl(url: string) {
    objectUrls.current.add(url);
    return url;
  }

  function forgetObjectUrl(url: string) {
    if (objectUrls.current.delete(url)) {
      URL.revokeObjectURL(url);
    }
  }

  function openPicker() {
    if (uploading) {
      return;
    }
    inputRef.current?.click();
  }

  async function uploadOne(key: string, file: File) {
    inFlight.current += 1;
    setUploadingState(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (articleId) {
        formData.append("article_id", articleId);
      }
      const result = await uploadNewsImage(formData);
      const uploadedUrl = result.url;
      if (result.error || !uploadedUrl) {
        setItems((current) =>
          current.map((item) =>
            item.key === key
              ? { ...item, uploading: false, errorKey: "photoUpload", file }
              : item,
          ),
        );
        return;
      }
      setItems((current) =>
        current.map((item) => {
          if (item.key !== key) {
            return item;
          }
          forgetObjectUrl(item.previewUrl);
          return {
            key: item.key,
            id: result.id,
            url: uploadedUrl,
            previewUrl: uploadedUrl,
            uploading: false,
          };
        }),
      );
    } catch (error) {
      console.error("Upload news image failed:", error);
      setItems((current) =>
        current.map((item) =>
          item.key === key
            ? { ...item, uploading: false, errorKey: "photoUpload", file }
            : item,
        ),
      );
    } finally {
      inFlight.current = Math.max(0, inFlight.current - 1);
      if (inFlight.current === 0) {
        setUploadingState(false);
      }
    }
  }

  function queueFiles(files: File[]) {
    const pending = files.map((file) => {
      const previewUrl = trackObjectUrl(URL.createObjectURL(file));
      return {
        key: crypto.randomUUID(),
        previewUrl,
        url: "",
        uploading: true,
        file,
      } satisfies GalleryItem;
    });
    setItems((current) => [...current, ...pending]);
    for (const item of pending) {
      void uploadOne(item.key, item.file!);
    }
  }

  function handleFiles(files: FileList | File[] | null) {
    if (!files || uploading) {
      return;
    }
    const picked = pickNewsImages(files);
    setBatchErrors(picked.rejected);
    setActionError(null);
    if (picked.accepted.length === 0) {
      return;
    }
    queueFiles(picked.accepted);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCount.current = 0;
    setDragging(false);
    if (uploading) {
      return;
    }
    handleFiles(event.dataTransfer.files);
  }

  function onDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (uploading) {
      return;
    }
    dragCount.current += 1;
    setDragging(true);
  }

  function onDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = uploading ? "none" : "copy";
  }

  function onDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCount.current = Math.max(0, dragCount.current - 1);
    if (dragCount.current === 0) {
      setDragging(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  }

  async function removeItem(key: string) {
    const item = items.find((entry) => entry.key === key);
    if (!item || item.uploading) {
      return;
    }
    setActionError(null);
    if (item.id) {
      const formData = new FormData();
      formData.append("id", item.id);
      const result = await deleteNewsImage(formData);
      if (result.error) {
        setActionError(result.error);
        return;
      }
    }
    forgetObjectUrl(item.previewUrl);
    setItems((current) => current.filter((entry) => entry.key !== key));
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) {
      return;
    }
    const current = items[index];
    const neighbor = items[swapIndex];
    if (current.uploading || neighbor.uploading) {
      return;
    }
    setActionError(null);
    setItems((list) => {
      const next = [...list];
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next;
    });
    if (current.id && neighbor.id) {
      const formData = new FormData();
      formData.append("id", current.id);
      formData.append("direction", direction);
      const result = await moveNewsImage(formData);
      if (result.error) {
        setItems((list) => {
          const next = [...list];
          const currentIndex = next.findIndex((entry) => entry.key === current.key);
          const neighborIndex = next.findIndex((entry) => entry.key === neighbor.key);
          if (currentIndex >= 0 && neighborIndex >= 0) {
            [next[currentIndex], next[neighborIndex]] = [
              next[neighborIndex],
              next[currentIndex],
            ];
          }
          return next;
        });
        setActionError(result.error);
      }
    }
  }

  async function retryItem(item: GalleryItem) {
    if (!item.file) {
      return;
    }
    setBatchErrors([]);
    setActionError(null);
    setItems((current) =>
      current.map((entry) =>
        entry.key === item.key
          ? { ...entry, uploading: true, errorKey: undefined }
          : entry,
      ),
    );
    await uploadOne(item.key, item.file);
  }

  const describedBy = [
    hintId,
    batchErrors.length > 0 || actionError ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-1.5">
      <span id={labelId} className="block text-sm text-ink">
        {t("gallery")}
      </span>
      <input type="hidden" name="cover_image_url" value={coverUrl} />
      <input type="hidden" name="gallery_urls" value={JSON.stringify(galleryUrls)} />
      <input
        ref={inputRef}
        type="file"
        accept={NEWS_IMAGE_ACCEPT}
        multiple
        className="sr-only"
        tabIndex={-1}
        disabled={uploading}
        aria-labelledby={labelId}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <div
        role="button"
        tabIndex={uploading ? -1 : 0}
        aria-disabled={uploading}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-busy={uploading}
        onClick={openPicker}
        onKeyDown={onKeyDown}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative flex min-h-48 w-full flex-col items-center justify-center rounded-sm border border-dashed px-4 py-6 text-center outline-none transition-colors focus-visible:border-accent ${
          uploading ? "cursor-wait" : "cursor-pointer"
        } ${
          dragging
            ? "border-accent bg-paper-muted"
            : "border-ink/15 bg-paper hover:border-ink/30"
        }`}
      >
        <span className="text-sm text-ink">{t("galleryDropHint")}</span>
        <span id={hintId} className="mt-3 text-xs text-ink-muted">
          {t("photoAccepted")}
        </span>
        {uploading ? (
          <span className="absolute inset-0 flex items-center justify-center gap-2 bg-paper/80 text-sm text-ink">
            <span
              className="inline-block size-5 animate-spin rounded-full border-2 border-ink/20 border-t-accent"
              aria-hidden
            />
            {t("photoUploading")}
          </span>
        ) : null}
      </div>
      {items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={item.key}
              className="relative overflow-hidden rounded-sm border border-ink/10 bg-paper"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.previewUrl}
                alt=""
                className="aspect-[16/9] w-full object-cover"
              />
              {item.uploading ? (
                <span className="absolute inset-0 flex items-center justify-center bg-paper/80">
                  <span
                    className="inline-block size-5 animate-spin rounded-full border-2 border-ink/20 border-t-accent"
                    aria-hidden
                  />
                  <span className="sr-only">{t("photoUploading")}</span>
                </span>
              ) : null}
              <div className="flex flex-wrap items-center gap-1 p-2">
                <button
                  type="button"
                  onClick={() => void moveItem(index, "up")}
                  disabled={index === 0 || item.uploading}
                  aria-label={t("moveUp")}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-ink hover:text-accent disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => void moveItem(index, "down")}
                  disabled={index === items.length - 1 || item.uploading}
                  aria-label={t("moveDown")}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-ink hover:text-accent disabled:opacity-40"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => void removeItem(item.key)}
                  disabled={item.uploading}
                  className="min-h-11 px-2 text-sm text-ink hover:text-accent disabled:opacity-40"
                >
                  {t("remove")}
                </button>
                {item.errorKey && item.file ? (
                  <button
                    type="button"
                    onClick={() => void retryItem(item)}
                    className="min-h-11 px-2 text-sm text-ink hover:text-accent"
                  >
                    {t("retryUpload")}
                  </button>
                ) : null}
              </div>
              {item.errorKey ? (
                <p role="alert" className="px-2 pb-2 text-xs text-ink">
                  {errors(item.errorKey)}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {batchErrors.length > 0 || actionError ? (
        <div id={errorId} role="alert" className="space-y-1">
          {batchErrors.map((entry) => (
            <p key={`${entry.error}-${entry.name}`} className="text-sm text-ink">
              {errors(entry.error, { name: entry.name })}
            </p>
          ))}
          {actionError ? <p className="text-sm text-ink">{actionError}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
