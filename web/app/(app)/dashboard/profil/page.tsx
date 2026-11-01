import type { Metadata } from "next";
import { ProfileView } from "@/features/profile/ProfileView";

export const metadata: Metadata = {
  title: "Mon profil",
  description: "Informations académiques et statut du compte Campusly.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
