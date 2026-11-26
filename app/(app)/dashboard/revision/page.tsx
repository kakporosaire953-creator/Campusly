import { pageMetadata } from "@/lib/i18n/metadata";
import { Suspense } from "react";
import { RevisionHub } from "@/features/revision/RevisionHub";
import { LoadingGrid } from "@/components/ui/States";

export async function generateMetadata() {
  return pageMetadata("revisionTitle", "/dashboard/revision");
}

export default function RevisionPage() {
  return (
    <Suspense fallback={<LoadingGrid count={2} />}>
      <RevisionHub />
    </Suspense>
  );
}
