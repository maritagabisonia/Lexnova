"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

const faqKeys = ["q1", "q2", "q3", "q4", "q5"] as const;

export function ContactFaq() {
  const t = useTranslations("contact.faq");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {faqKeys.map((questionKey, index) => {
        const expanded = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        const answerKey = `a${index + 1}` as "a1" | "a2" | "a3" | "a4" | "a5";

        return (
          <div key={questionKey}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left text-base text-ink hover:text-accent"
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span>{t(questionKey)}</span>
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
              {expanded ? t(answerKey, { email: site.email }) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
