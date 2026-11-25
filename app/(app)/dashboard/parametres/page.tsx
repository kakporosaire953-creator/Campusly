import { pageMetadata } from "@/lib/i18n/metadata";
import { SettingsView } from "@/features/profile/SettingsView";

export async function generateMetadata() {
  return pageMetadata("settingsTitle", "/dashboard/parametres");
}

export default function SettingsPage() {
  return <SettingsView />;
}
