import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-accent/40 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-serif text-2xl tracking-tight">{site.name}</p>
          <p className="max-w-xs text-sm leading-relaxed text-paper/80">
            {site.tagline}
          </p>
        </div>

        <div className="space-y-2 text-sm text-paper/80">
          <p className="font-medium text-paper">Contact</p>
          <p>{site.address}</p>
          <p>
            <a className="hover:text-accent" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <p>
            <a className="hover:text-accent" href={`tel:${site.phone}`}>
              {site.phone}
            </a>
          </p>
        </div>

        <p className="text-sm text-paper/70 md:text-right">
          © {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
