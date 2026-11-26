import { pageMetadata } from "@/lib/i18n/metadata";
import { RoleHome } from "@/features/dashboard/RoleHome";

export async function generateMetadata() {
  return pageMetadata("dashboardTitle", "/dashboard");
}

export default function DashboardPage() {
  return <RoleHome />;
}
