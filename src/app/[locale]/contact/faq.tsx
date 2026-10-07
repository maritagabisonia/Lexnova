"use client";

import { useState } from "react";
import type { PublicFaqItem } from "@/lib/public-faq";

export function ContactFaq({ items }: { items: PublicFaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, index) => {
        const expanded = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left text-base text-ink hover:text-accent"
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span>{item.question}</span>
                <span className="text-ink-muted" aria-hidden="true">
                  {expanded ? "–" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
              className="pb-4 text-sm leading-relaxed text-ink-muted"
            >
              {expanded ? item.answer : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
