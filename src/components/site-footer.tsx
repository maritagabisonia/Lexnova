import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { phoneHref, site } from "@/lib/site";

const legalNav = [
  { href: "/privacy-policy", key: "privacyPolicy" },
  { href: "/terms", key: "terms" },
  { href: "/cookie-policy", key: "cookiePolicy" },
] as const;

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const brand = await getTranslations("brand");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-accent/40 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-serif text-2xl tracking-tight">{site.name}</p>
          <p className="max-w-xs text-sm leading-relaxed text-paper/80">
            {brand("tagline")}
          </p>
        </div>

        <div className="space-y-2 text-sm text-paper/80">
          <p className="font-medium text-paper">{t("contact")}</p>
          <p>{site.address}</p>
          <p>
            <a
              className="inline-flex min-h-11 items-center hover:text-accent md:min-h-0"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
          </p>
          <p>
            <a
              className="inline-flex min-h-11 items-center hover:text-accent md:min-h-0"
              href={phoneHref()}
            >
              {site.phone}
            </a>
          </p>
        </div>

        <div className="space-y-2 text-sm text-paper/80">
          {/* PLACEHOLDER: Legal links — copy on these pages needs a lawyer before launch. */}
          <p className="font-medium text-paper">{t("legal")}</p>
          <ul>
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center hover:text-accent md:min-h-0"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-10 text-sm text-paper/70 sm:px-6 md:text-right">
        {t("copyright", { year, name: site.name })}
      </p>
    </footer>
  );
}
