import type { Metadata } from "next";
import { ForumBoard } from "@/features/forum/ForumBoard";

export const metadata: Metadata = {
  title: "Forum & entraide",
  description: "Forum étudiant Campusly : questions, réponses et fiches partagées.",
};

export default function ForumPage() {
  return <ForumBoard />;
}
