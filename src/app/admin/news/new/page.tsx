import type { Metadata } from "next";
import Link from "next/link";
import {
  emptyNewsFormValues,
  getAdminRelatedPrograms,
} from "@/lib/admin-news";
import { ArticleForm } from "../article-form";

export const metadata: Metadata = {
  title: "New Article",
};

export default async function NewArticlePage() {
  const programs = await getAdminRelatedPrograms();

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/news" className="text-ink-muted hover:text-accent">
          News
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">New Article</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        Drafts stay off the public news page until you publish.
      </p>
      <ArticleForm
        mode="create"
        article={emptyNewsFormValues}
        programs={programs}
      />
    </section>
  );
}
