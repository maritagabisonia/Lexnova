export function AdminPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section>
      <h1 className="text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {description}
      </p>
    </section>
  );
}
