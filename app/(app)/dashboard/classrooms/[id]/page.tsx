import type { Metadata } from "next";
import { ClassroomDetail } from "@/features/classrooms/ClassroomDetail";

export const metadata: Metadata = { title: "Classroom" };

export default async function ClassroomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClassroomDetail classroomId={id} />;
}
