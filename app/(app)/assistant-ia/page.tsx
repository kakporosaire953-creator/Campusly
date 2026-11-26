import { pageMetadata } from "@/lib/i18n/metadata";
import { AssistantChat } from "@/features/ai/AssistantChat";

export async function generateMetadata() {
  return pageMetadata("assistantTitle", "/assistant-ia");
}

export default function AssistantPage() {
  return <AssistantChat />;
}
