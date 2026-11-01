import type { Metadata } from "next";
import { NotificationCenter } from "@/features/notifications/NotificationCenter";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Centre de notifications Campusly.",
};

export default function NotificationsPage() {
  return <NotificationCenter />;
}
