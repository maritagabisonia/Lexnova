import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin-placeholder";

export const metadata: Metadata = {
  title: "News",
};

export default function AdminNewsPage() {
  return (
    <AdminPlaceholder
      title="News"
      description="Publish and update news articles from this list."
    />
  );
}
