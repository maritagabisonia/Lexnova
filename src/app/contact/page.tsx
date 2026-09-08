import type { Metadata } from "next";
import { ContactFaq } from "@/app/contact/faq";
import { ContactForm } from "@/app/contact/contact-form";
import { publicPages } from "@/lib/seo";
import { site, socialLinks } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return publicPages.contact;
}

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl sm:text-5xl">Contact</h1>
        <p className="mt-4 max-w-2xl text-sm text-ink-muted sm:text-base">
          Write to us about programs, group bookings, or a question about your
          registration.
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <ContactForm />

          <div className="space-y-8 text-sm">
            {/* PLACEHOLDER: Contact details */}
            <div>
              <h2 className="text-xl">Details</h2>
              <address className="mt-3 not-italic leading-relaxed text-ink-muted">
                <p>{site.address}</p>
                <p className="mt-2">
                  <a
                    className="inline-flex min-h-11 items-center text-ink hover:text-accent"
                    href={`mailto:${site.email}`}
                  >
                    {site.email}
                  </a>
                </p>
                <p>
                  <a
                    className="inline-flex min-h-11 items-center text-ink hover:text-accent"
                    href={`tel:${site.phone}`}
                  >
                    {site.phone}
                  </a>
                </p>
              </address>
            </div>

            {/* PLACEHOLDER: Social links */}
            <div>
              <h2 className="text-xl">Follow</h2>
              <ul className="mt-3 text-ink-muted">
                {socialLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="inline-flex min-h-11 items-center text-ink hover:text-accent"
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper-muted/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">FAQ</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Short answers while we write the full handbook.
          </p>
          <div className="mt-8">
            <ContactFaq />
          </div>
        </div>
      </section>
    </div>
  );
}
