import { pageMetadata } from "@/lib/i18n/metadata";
import { NotificationCenter } from "@/features/notifications/NotificationCenter";

export async function generateMetadata() {
  return pageMetadata("notificationsTitle", "/dashboard/notifications");
}

export default function NotificationsPage() {
  return <NotificationCenter />;
}
