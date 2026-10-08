import {
  LECTURER_PHOTO_ACCEPT,
  LECTURER_PHOTO_BUCKET,
  LECTURER_PHOTO_MAX_BYTES,
  lecturerPhotoContentType,
  lecturerPhotoExtension,
} from "@/lib/lecturer-photo";

export const NEWS_IMAGE_BUCKET = LECTURER_PHOTO_BUCKET;
export const NEWS_IMAGE_MAX_BYTES = LECTURER_PHOTO_MAX_BYTES;
export const NEWS_IMAGE_ACCEPT = LECTURER_PHOTO_ACCEPT;

export {
  lecturerPhotoContentType as newsImageContentType,
  lecturerPhotoExtension as newsImageExtension,
};

export type NewsImageErrorKey = "photoType" | "photoSize" | "photoUpload";

export type NewsImagePickRejection = {
  name: string;
  error: "photoTypeNamed" | "photoSizeNamed";
};

export function pickNewsImages(files: FileList | File[]): {
  accepted: File[];
  rejected: NewsImagePickRejection[];
} {
  const accepted: File[] = [];
  const rejected: NewsImagePickRejection[] = [];

  for (const file of Array.from(files)) {
    if (!lecturerPhotoExtension(file)) {
      rejected.push({ name: file.name, error: "photoTypeNamed" });
      continue;
    }
    if (file.size > NEWS_IMAGE_MAX_BYTES) {
      rejected.push({ name: file.name, error: "photoSizeNamed" });
      continue;
    }
    accepted.push(file);
  }

  return { accepted, rejected };
}
