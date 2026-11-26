import { pageMetadata } from "@/lib/i18n/metadata";
import { ClassroomList } from "@/features/classrooms/ClassroomList";

export async function generateMetadata() {
  return pageMetadata("classroomsTitle", "/dashboard/classrooms");
}

export default function ClassroomsPage() {
  return <ClassroomList />;
}
