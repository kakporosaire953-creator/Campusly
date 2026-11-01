import type { Metadata } from "next";
import { SettingsView } from "@/features/profile/SettingsView";

export const metadata: Metadata = {
  title: "Paramètres",
  description: "Notifications, accessibilité et données de démonstration Campusly.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
