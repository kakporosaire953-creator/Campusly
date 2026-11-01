import type { Metadata } from "next";
import { ClassroomList } from "@/features/classrooms/ClassroomList";

export const metadata: Metadata = {
  title: "Classrooms",
  description: "Amphis virtuels Campusly : ressources, devoirs, annonces et suivi de classe.",
};

export default function ClassroomsPage() {
  return <ClassroomList />;
}
