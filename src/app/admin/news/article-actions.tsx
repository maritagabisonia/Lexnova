"use client";

import { useActionState } from "react";
import { AuthMessage } from "@/components/auth-form";
import { archiveArticle, type NewsActionState } from "./actions";

const initialState: NewsActionState = {};

export function ArchiveArticleButton({
  articleId,
  compact = false,
}: {
  articleId: string;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState(archiveArticle, initialState);

  return (
    <form action={action} className={compact ? "inline" : "space-y-2"}>
      <input type="hidden" name="id" value={articleId} />
      {state.error ? (
        compact ? (
          <span role="alert" className="mr-2 text-xs text-ink">
            {state.error}
          </span>
        ) : (
          <AuthMessage state={state} />
        )
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={
          compact
            ? "text-sm text-ink hover:text-accent disabled:opacity-60"
            : "inline-flex min-h-11 items-center text-sm text-ink hover:text-accent disabled:opacity-60"
        }
      >
        {pending ? "Archiving…" : "Archive"}
      </button>
    </form>
  );
}
