import type { Metadata } from "next";
import { AdminPanel } from "@/features/dashboard/AdminPanel";

export const metadata: Metadata = {
  title: "Administration",
  description: "Validation des contributions et supervision de la plateforme Campusly.",
};

export default function AdminPage() {
  return <AdminPanel />;
}
