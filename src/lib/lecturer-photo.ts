export const LECTURER_PHOTO_BUCKET = "lecturer-photos";
export const LECTURER_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const LECTURER_PHOTO_ACCEPT =
  "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

const TYPE_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const NAME_EXT = /\.(jpe?g|png|webp)$/i;

export type LecturerPhotoErrorKey = "photoType" | "photoSize" | "photoOne";

export function lecturerPhotoExtension(file: { type: string; name: string }) {
  if (TYPE_TO_EXT[file.type]) {
    return TYPE_TO_EXT[file.type];
  }
  const match = file.name.match(NAME_EXT);
  if (!match) {
    return null;
  }
  const ext = match[1].toLowerCase();
  return ext === "jpeg" ? "jpg" : ext;
}

export function lecturerPhotoContentType(ext: string) {
  if (ext === "png") {
    return "image/png";
  }
  if (ext === "webp") {
    return "image/webp";
  }
  return "image/jpeg";
}

export function pickLecturerPhoto(
  files: FileList | File[],
): { file: File } | { error: LecturerPhotoErrorKey } {
  const list = Array.from(files);
  if (list.length === 0) {
    return { error: "photoType" };
  }
  if (list.length > 1) {
    return { error: "photoOne" };
  }
  const file = list[0];
  if (!lecturerPhotoExtension(file)) {
    return { error: "photoType" };
  }
  if (file.size > LECTURER_PHOTO_MAX_BYTES) {
    return { error: "photoSize" };
  }
  return { file };
}
