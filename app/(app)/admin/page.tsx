import { pageMetadata } from "@/lib/i18n/metadata";
import { AdminPanel } from "@/features/dashboard/AdminPanel";

export async function generateMetadata() {
  return pageMetadata("adminTitle", "/admin");
}

export default function AdminPage() {
  return <AdminPanel />;
}
