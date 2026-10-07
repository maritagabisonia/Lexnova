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
import {
  LECTURER_PHOTO_ACCEPT,
  pickLecturerPhoto,
  type LecturerPhotoErrorKey,
} from "@/lib/lecturer-photo";
import { uploadLecturerPhoto } from "./actions";

export function LecturerPhotoField({
  lecturerId,
  initialUrl,
  onUploadingChange,
}: {
  lecturerId?: string;
  initialUrl: string;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const t = useTranslations("admin.form");
  const errors = useTranslations("admin.errors");
  const labelId = useId();
  const hintId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCount = useRef(0);
  const objectUrl = useRef<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState(initialUrl);
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorKey, setErrorKey] = useState<
    LecturerPhotoErrorKey | "photoUpload" | null
  >(null);

  useEffect(() => {
    return () => {
      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current);
      }
    };
  }, []);

  function setUploadingState(value: boolean) {
    setUploading(value);
    onUploadingChange?.(value);
  }

  function setLocalPreview(file: File) {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
    }
    const next = URL.createObjectURL(file);
    objectUrl.current = next;
    setPreviewUrl(next);
  }

  function clearLocalPreview() {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
  }

  function openPicker() {
    if (uploading) {
      return;
    }
    inputRef.current?.click();
  }

  async function uploadFile(file: File) {
    setErrorKey(null);
    setLocalPreview(file);
    setUploadingState(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (lecturerId) {
        formData.append("lecturer_id", lecturerId);
      }
      const result = await uploadLecturerPhoto(formData);
      if (result.error || !result.url) {
        setErrorKey("photoUpload");
        return;
      }
      clearLocalPreview();
      setPhotoUrl(result.url);
      setPreviewUrl(result.url);
    } catch (error) {
      console.error("Upload lecturer photo failed:", error);
      setErrorKey("photoUpload");
    } finally {
      setUploadingState(false);
    }
  }

  function handleFiles(files: FileList | File[] | null) {
    if (!files || uploading) {
      return;
    }
    const picked = pickLecturerPhoto(files);
    if ("error" in picked) {
      setErrorKey(picked.error);
      return;
    }
    void uploadFile(picked.file);
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

  function removePhoto() {
    if (uploading) {
      return;
    }
    clearLocalPreview();
    setPhotoUrl("");
    setPreviewUrl("");
    setErrorKey(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <span id={labelId} className="block text-sm text-ink">
        {t("photo")}
      </span>
      <input type="hidden" name="photo_url" value={photoUrl} />
      <input
        ref={inputRef}
        type="file"
        accept={LECTURER_PHOTO_ACCEPT}
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
        aria-describedby={errorKey ? `${hintId} ${errorId}` : hintId}
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
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="h-36 w-36 object-cover" />
        ) : (
          <span className="text-sm text-ink">{t("photoDropHint")}</span>
        )}
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
      {previewUrl && !uploading ? (
        <div className="flex flex-wrap gap-4 text-sm">
          <button
            type="button"
            onClick={openPicker}
            className="text-ink hover:text-accent"
          >
            {t("changePhoto")}
          </button>
          <button
            type="button"
            onClick={removePhoto}
            className="text-ink hover:text-accent"
          >
            {t("removePhoto")}
          </button>
        </div>
      ) : null}
      {errorKey ? (
        <p id={errorId} role="alert" className="text-sm text-ink">
          {errors(errorKey)}
        </p>
      ) : null}
    </div>
  );
}
