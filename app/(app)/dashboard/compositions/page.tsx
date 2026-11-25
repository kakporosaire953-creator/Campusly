import { pageMetadata } from "@/lib/i18n/metadata";
import { CompositionList } from "@/features/compositions/CompositionList";

export async function generateMetadata() {
  return pageMetadata("compositionsTitle", "/dashboard/compositions");
}

export default function CompositionsPage() {
  return <CompositionList />;
}
