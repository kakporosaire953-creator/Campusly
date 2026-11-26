import { pageMetadata } from "@/lib/i18n/metadata";
import { ForumBoard } from "@/features/forum/ForumBoard";

export async function generateMetadata() {
  return pageMetadata("forumTitle", "/dashboard/forum");
}

export default function ForumPage() {
  return <ForumBoard />;
}
