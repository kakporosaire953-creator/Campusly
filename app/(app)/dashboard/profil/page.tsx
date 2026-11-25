import { pageMetadata } from "@/lib/i18n/metadata";
import { ProfileView } from "@/features/profile/ProfileView";

export async function generateMetadata() {
  return pageMetadata("profileTitle", "/dashboard/profil");
}

export default function ProfilePage() {
  return <ProfileView />;
}
