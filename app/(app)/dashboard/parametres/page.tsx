import type { Metadata } from "next";
import { SettingsView } from "@/features/profile/SettingsView";

export const metadata: Metadata = {
  title: "Paramètres",
  description: "Notifications, accessibilité et données locales Campusly.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
