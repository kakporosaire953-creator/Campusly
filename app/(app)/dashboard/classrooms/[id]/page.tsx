import { pageMetadata } from "@/lib/i18n/metadata";
import { ClassroomDetail } from "@/features/classrooms/ClassroomDetail";

export async function generateMetadata() {
  return pageMetadata("classroomDetailTitle", "/dashboard/classrooms");
}

export default async function ClassroomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClassroomDetail classroomId={id} />;
}
