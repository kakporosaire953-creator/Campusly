import { pageMetadata } from "@/lib/i18n/metadata";
import { TeacherOverview } from "@/features/dashboard/TeacherOverview";

export async function generateMetadata() {
  return pageMetadata("teacherTitle", "/enseignant");
}

export default function TeacherPage() {
  return <TeacherOverview />;
}
