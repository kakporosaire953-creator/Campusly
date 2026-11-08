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
  /**
   * État réel de la plateforme, affiché sur les pages qui doivent l'expliquer
   * (connexion, à propos). Ce n'est plus un bandeau permanent.
   */
  environmentNotice:
    "Version de préfiguration : la connexion et les données restent sur cet appareil jusqu'à l'ouverture du backend.",
  /** Version du frontend (phase de migration). */
  version: "3.0.0-web",
} as const;

/**
 * Navigation publique.
 * Quatre entrées au maximum : chaque lien pointe vers une section réellement
 * présente sur l'accueil. Les ancres sont absolues (`/#…`) pour rester
 * valides depuis les pages légales et « à propos ».
 */
export const publicNav = [
  { href: "/#fonctionnalites", label: "Fonctionnalités" },
  { href: "/#campusly-ai", label: "Campusly AI" },
  { href: "/#etablissements", label: "Établissements" },
  { href: "/#faq", label: "FAQ" },
] as const;

export interface FooterLink {
  href: string;
  label: string;
}

/** Pied de page : quatre familles de liens + un bloc institutionnel. */
export const footerNav: ReadonlyArray<{ title: string; links: readonly FooterLink[] }> = [
  {
    title: "Plateforme",
    links: [
      { href: "/dashboard/epreuves", label: "Épreuves et annales" },
      { href: "/dashboard/classrooms", label: "Espaces de cours" },
      { href: "/dashboard/revision", label: "Révision et quiz" },
      { href: "/dashboard/compositions", label: "Compositions" },
      { href: "/dashboard", label: "Tableau de bord" },
    ],
  },
  {
    title: "Fonctionnalités",
    links: [
      { href: "/#fonctionnalites", label: "Vue d'ensemble" },
      { href: "/#campusly-ai", label: "Campusly AI" },
      { href: "/#parcours", label: "Progression" },
      { href: "/#enseignants", label: "Espace enseignants" },
      { href: "/#faq", label: "Questions fréquentes" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/contribuer", label: "Contribuer" },
      { href: "/#etablissements", label: "Établissements" },
      { href: "/offline", label: "Mode hors ligne" },
      { href: "/a-propos#contact", label: "Contact" },
    ],
  },
  {
    title: "Institutions",
    links: [
      { href: "/a-propos#contact", label: "Demander une démonstration" },
      { href: "/a-propos#contact", label: "Proposer un partenariat" },
      { href: "/conditions", label: "Conditions d'utilisation" },
      { href: "/politique-de-confidentialite", label: "Confidentialité" },
    ],
  },
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
