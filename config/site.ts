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
  { href: "/#experience", labelKey: "nav.features", label: "Fonctions" },
  { href: "/#campusly-ai", labelKey: "nav.ai", label: "Campusly AI" },
  { href: "/#compositions", labelKey: "nav.compositions", label: "Compositions" },
  { href: "/a-propos", labelKey: "nav.project", label: "Le projet" },
] as const;

export interface FooterLink {
  href: string;
  label: string;
}

/** Pied de page : quatre familles de liens + un bloc institutionnel. */
export const footerNav: ReadonlyArray<{
  titleKey: string;
  links: readonly (FooterLink & { labelKey: string })[];
}> = [
  {
    titleKey: "footer.groupCampusly",
    links: [
      { href: "/a-propos", labelKey: "footer.linkAbout", label: "À propos" },
      { href: "/contribuer", labelKey: "footer.linkContribute", label: "Contribuer" },
      { href: "/#campusly-ai", labelKey: "footer.linkAi", label: "Campusly AI" },
      { href: "/#compositions", labelKey: "footer.linkCompositions", label: "Compositions" },
      { href: "/a-propos#contact", labelKey: "footer.linkContact", label: "Contact" },
    ],
  },
  {
    titleKey: "footer.groupPlatform",
    links: [
      { href: "/dashboard/epreuves", labelKey: "footer.linkExams", label: "Épreuves et annales" },
      { href: "/dashboard/classrooms", labelKey: "footer.linkClassrooms", label: "Espaces de cours" },
      { href: "/dashboard/revision", labelKey: "footer.linkRevision", label: "Révision et quiz" },
      { href: "/dashboard/compositions", labelKey: "footer.linkCompositions", label: "Compositions" },
      { href: "/dashboard", labelKey: "footer.linkDashboard", label: "Tableau de bord" },
    ],
  },
  {
    titleKey: "footer.groupResources",
    links: [
      { href: "/#experience", labelKey: "footer.linkOverview", label: "Vue d'ensemble" },
      { href: "/#faq", labelKey: "footer.linkFaq", label: "Questions fréquentes" },
      { href: "/offline", labelKey: "footer.linkOffline", label: "Mode hors ligne" },
      { href: "/conditions", labelKey: "footer.linkTerms", label: "Conditions d'utilisation" },
    ],
  },
] as const;

/** Élément de navigation de l'espace applicatif. */
export interface AppNavItem {
  href: string;
  /** Clé de dictionnaire (`app.*`) — la coquille ne reçoit aucun libellé en dur. */
  labelKey: string;
  label: string;
  icon: string;
  /** Rôles pour lesquels l'entrée est affichée (présentation uniquement). */
  roles: readonly UserRole[];
  /** Groupe de navigation : menu principal ou compte. */
  group?: "main" | "account";
}

/** Navigation de l'espace applicatif, filtrée par rôle. */
export const appNav: readonly AppNavItem[] = [
  { href: "/dashboard", labelKey: "app.navOverview", label: "Vue d'ensemble", icon: "fa-solid fa-chart-pie", roles: ["learner", "teacher", "admin"] },
  { href: "/dashboard/revision", labelKey: "app.navRevision", label: "Campusly AI & Quiz", icon: "fa-solid fa-brain", roles: ["learner", "teacher"] },
  { href: "/dashboard/classrooms", labelKey: "app.navClassrooms", label: "Classrooms Amphi", icon: "fa-solid fa-chalkboard-user", roles: ["learner", "teacher", "admin"] },
  { href: "/dashboard/compositions", labelKey: "app.navCompositions", label: "Compositions", icon: "fa-solid fa-stopwatch", roles: ["learner", "teacher"] },
  { href: "/dashboard/epreuves", labelKey: "app.navExams", label: "Épreuves & Annales", icon: "fa-solid fa-folder-open", roles: ["learner", "teacher", "admin"] },
  { href: "/dashboard/forum", labelKey: "app.navForum", label: "Forum & Entraide", icon: "fa-solid fa-comments", roles: ["learner", "teacher", "admin"] },
  { href: "/dashboard/credits", labelKey: "app.navCredits", label: "Campusly Credits", icon: "fa-solid fa-bolt", roles: ["learner", "teacher"] },
  { href: "/enseignant", labelKey: "app.navTeacher", label: "Espace enseignant", icon: "fa-solid fa-person-chalkboard", roles: ["teacher"] },
  { href: "/admin", labelKey: "app.navAdmin", label: "Panel admin", icon: "fa-solid fa-shield-halved", roles: ["admin"] },
  { href: "/dashboard/notifications", labelKey: "app.navNotifications", label: "Notifications", icon: "fa-regular fa-bell", roles: ["learner", "teacher", "admin"], group: "account" },
  { href: "/dashboard/abonnement", labelKey: "app.navSubscription", label: "Abonnement", icon: "fa-solid fa-crown", roles: ["learner", "teacher", "admin"], group: "account" },
  { href: "/dashboard/profil", labelKey: "app.navProfile", label: "Mon profil", icon: "fa-regular fa-user", roles: ["learner", "teacher", "admin"], group: "account" },
  { href: "/dashboard/parametres", labelKey: "app.navSettings", label: "Paramètres", icon: "fa-solid fa-gear", roles: ["learner", "teacher", "admin"], group: "account" },
] as const;

export const roleLabels = {
  learner: "Étudiant UAC",
  teacher: "Enseignant",
  admin: "Administrateur",
} as const;

/** Clés de dictionnaire correspondantes, pour les écrans traduits. */
export const roleLabelKeys: Record<UserRole, string> = {
  learner: "app.roleLearner",
  teacher: "app.roleTeacher",
  admin: "app.roleAdmin",
};
