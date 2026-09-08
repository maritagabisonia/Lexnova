export function CoverImage({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex max-w-full items-center justify-center bg-paper-muted font-serif text-ink-muted ${className}`}
        aria-hidden="true"
      >
        News
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`max-w-full object-cover ${className}`} />
  );
}
