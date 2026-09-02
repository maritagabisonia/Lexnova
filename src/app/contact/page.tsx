import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Contact</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        Write to us about programs, group bookings, or a question about your
        registration.
      </p>
      <div className="mt-8 space-y-2 text-sm text-ink">
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
    </section>
  );
}
