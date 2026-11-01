import type { UserRole } from "@/types";

/**
 * Configuration statique du frontend Campusly.
 * Aucun secret, aucune URL de backend : uniquement de la présentation.
 */

export const siteConfig = {
  name: "Campusly",
  tagline: "La plateforme académique intelligente des étudiants et professeurs de l'UAC",
  description:
    "Accédez aux anciennes épreuves, révisez avec Campusly AI, créez des évaluations et suivez votre progression.",
  supportEmail: "support@campusly.uac.bj",
  whatsapp: "+229 97 00 00 00",
  /** Mention affichée partout où des données fictives sont utilisées. */
  demoNotice:
    "Environnement de démonstration : toutes les données affichées sont fictives et aucune action n'est enregistrée sur un serveur.",
  /** Version du frontend (phase de migration). */
  version: "3.0.0-web",
} as const;

/** Navigation publique (reprise de l'ancienne navbar). */
export const publicNav = [
  { href: "/#piliers", label: "Piliers" },
  { href: "/dashboard/revision", label: "Campusly AI" },
  { href: "/dashboard/classrooms", label: "Classrooms" },
  { href: "/dashboard/compositions", label: "Compositions" },
  { href: "/#tarifs", label: "Crédits & Tarifs" },
  { href: "/#faq", label: "FAQ" },
] as const;

/** Élément de navigation de l'espace applicatif. */
export interface AppNavItem {
  href: string;
  label: string;
  icon: string;
  /** Rôles pour lesquels l'entrée est affichée (présentation uniquement). */
  roles: readonly UserRole[];
  /** Groupe de navigation : menu principal ou compte. */
  group?: "main" | "account";
}

/** Navigation de l'espace applicatif, filtrée par rôle. */
export const appNav: readonly AppNavItem[] = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: "fa-solid fa-chart-pie", roles: ["learner", "teacher", "admin"] },
  { href: "/dashboard/revision", label: "Campusly AI & Quiz", icon: "fa-solid fa-brain", roles: ["learner", "teacher"] },
  { href: "/dashboard/classrooms", label: "Classrooms Amphi", icon: "fa-solid fa-chalkboard-user", roles: ["learner", "teacher", "admin"] },
  { href: "/dashboard/compositions", label: "Compositions", icon: "fa-solid fa-stopwatch", roles: ["learner", "teacher"] },
  { href: "/dashboard/epreuves", label: "Épreuves & Annales", icon: "fa-solid fa-folder-open", roles: ["learner", "teacher", "admin"] },
  { href: "/dashboard/forum", label: "Forum & Entraide", icon: "fa-solid fa-comments", roles: ["learner", "teacher", "admin"] },
  { href: "/dashboard/credits", label: "Campusly Credits", icon: "fa-solid fa-bolt", roles: ["learner", "teacher"] },
  { href: "/enseignant", label: "Espace enseignant", icon: "fa-solid fa-person-chalkboard", roles: ["teacher"] },
  { href: "/admin", label: "Panel admin", icon: "fa-solid fa-shield-halved", roles: ["admin"] },
  { href: "/dashboard/notifications", label: "Notifications", icon: "fa-regular fa-bell", roles: ["learner", "teacher", "admin"], group: "account" },
  { href: "/dashboard/abonnement", label: "Abonnement", icon: "fa-solid fa-crown", roles: ["learner", "teacher", "admin"], group: "account" },
  { href: "/dashboard/profil", label: "Mon profil", icon: "fa-regular fa-user", roles: ["learner", "teacher", "admin"], group: "account" },
  { href: "/dashboard/parametres", label: "Paramètres", icon: "fa-solid fa-gear", roles: ["learner", "teacher", "admin"], group: "account" },
] as const;

export const roleLabels = {
  learner: "Étudiant UAC",
  teacher: "Enseignant",
  admin: "Administrateur",
} as const;
