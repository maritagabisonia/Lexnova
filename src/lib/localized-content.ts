export function localizedText(
  locale: string,
  ka: string | null | undefined,
  en: string | null | undefined,
): string | null {
  const georgian = ka?.trim() ?? "";
  const english = en?.trim() ?? "";
  const preferred = locale === "ka" ? georgian : english;
  const fallback = locale === "ka" ? english : georgian;
  return preferred || fallback || null;
}
