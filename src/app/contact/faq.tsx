"use client";

import { useState } from "react";

/* PLACEHOLDER: FAQ — replace questions and answers. */
const faqs = [
  {
    question: "How do I register for a course or training?",
    answer:
      "Open the program page and use Register while registration is open. If you are not signed in, you will be asked to log in (or create a student account) and then returned to the program to complete enrollment.",
  },
  {
    question: "Will I receive a certificate?",
    answer:
      "Participants who complete a course or training receive a LexNova certificate of completion by email. Workshops that have already closed can request a reissue from hello@lexnova.org.",
  },
  {
    question: "How does payment work?",
    answer:
      "Fees are listed on each program page. We will send payment instructions after you register. Group bookings for a workplace cohort can be invoiced; write to us with the program name and headcount.",
  },
  {
    question: "Is attendance required? Can I join online?",
    answer:
      "Check the format on the program page. Hybrid sessions can be joined in the Civic Classroom or live online. Online-only programs have no in-person seat. We expect attendance at the sessions you book.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Cancellations more than fourteen days before the start date are refunded in full. After that, we can transfer your place to a later edition of the same program where one exists. Write to hello@lexnova.org with your name and the program title.",
  },
] as const;

export function ContactFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {faqs.map((item, index) => {
        const expanded = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div key={item.question}>
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
