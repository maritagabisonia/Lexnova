export const FIELD_MAX = {
  name: 200,
  email: 254,
  password: 72,
  title: 200,
  slug: 80,
  url: 2000,
  shortText: 2000,
  longText: 20000,
  message: 5000,
} as const;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return UUID_RE.test(value);
}

export function parseUuid(
  value: string,
  error = "We could not find that record.",
): { id: string } | { error: string } {
  const id = value.trim();
  if (!isUuid(id)) {
    return { error };
  }
  return { id };
}

export function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function tooLong(value: string, max: number, label: string) {
  if (value.length > max) {
    return `${label} is too long.`;
  }
  return null;
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
