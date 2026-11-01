import type { Metadata } from "next";
import { AssistantChat } from "@/features/ai/AssistantChat";

export const metadata: Metadata = {
  title: "Assistant IA",
  description: "Assistant conversationnel Campusly pour la révision et la compréhension des cours.",
};

export default function AssistantPage() {
  return <AssistantChat />;
}
