import { pageMetadata } from "@/lib/i18n/metadata";
import { ExamLibrary } from "@/features/exams/ExamLibrary";

export async function generateMetadata() {
  return pageMetadata("examLibraryTitle", "/dashboard/epreuves");
}

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ faculte?: string }>;
}) {
  const { faculte } = await searchParams;
  return <ExamLibrary initialFaculty={faculte} />;
}
