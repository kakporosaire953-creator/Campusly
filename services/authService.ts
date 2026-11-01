/**
 * authService — SIMULATION frontend
 * ---------------------------------------------------------------------------
 * Aucun mot de passe n'est vérifié, aucun appel réseau n'est effectué, aucun
 * jeton n'est créé. Ce service existe pour que l'interface soit navigable et
 * testable sans backend.
 *
 * En production, l'implémentation réelle appellera :
 *   POST /api/auth/login, POST /api/auth/register, GET /api/auth/session,
 *   POST /api/auth/logout (Better Auth + cookies httpOnly).
 * Les autorisations seront ensuite vérifiées à chaque requête côté serveur.
 */

import type {
  AuthServiceContract,
  AuthSession,
  LoginInput,
  ProfileUpdateInput,
  RegisterInput,
  TeacherActivationInput,
  TeacherStatus,
  UserProfile,
  UserRole,
} from "@/types";
import { ApiError } from "./api/client";
import { DEMO_LEARNER, DEMO_TEACHER, DEMO_USERS, computeLevel } from "./mocks/fixtures/users";
import { demoDelay, demoStore, nowIso } from "./mocks/store";

const SESSION_KEY = "session";
const PROFILE_KEY = "profile";
const LOGGED_OUT_KEY = "logged-out";

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  learner: DEMO_LEARNER,
  teacher: DEMO_TEACHER,
  admin: DEMO_USERS[2],
};

function buildDemoSession(profile: UserProfile): AuthSession {
  return { user: profile, expiresAt: new Date(Date.now() + 86_400_000).toISOString() };
}

class AuthService implements AuthServiceContract {
  /**
   * Session courante.
   *
   * Mode démonstration : une session « apprenant » par défaut est renvoyée afin
   * que les espaces étudiant / enseignant / admin soient explorables sans
   * backend. L'utilisateur peut changer de rôle depuis l'interface.
   */
  async getSession(): Promise<AuthSession | null> {
    await demoDelay(60);
    if (demoStore.read<boolean>(LOGGED_OUT_KEY, false)) return null;
    const stored = demoStore.read<AuthSession | null>(SESSION_KEY, null);
    if (stored?.user) return stored;
    return buildDemoSession(this.overlayProfile(DEMO_LEARNER));
  }

  /** Lecture synchrone (utile pour l'hydratation de l'interface). */
  getCachedSession(): AuthSession | null {
    if (demoStore.read<boolean>(LOGGED_OUT_KEY, false)) return null;
    const stored = demoStore.read<AuthSession | null>(SESSION_KEY, null);
    if (stored?.user) return stored;
    return buildDemoSession(this.overlayProfile(DEMO_LEARNER));
  }

  async login(input: LoginInput): Promise<AuthSession> {
    await demoDelay(320);
    const identifier = input.identifier.trim();
    if (!identifier) {
      throw ApiError.of("VALIDATION", "Renseignez votre matricule ou votre adresse e-mail.", {
        identifier: "Champ obligatoire",
      });
    }
    if (!input.password || input.password.length < 4) {
      throw ApiError.of("VALIDATION", "Le mot de passe est trop court.", {
        password: "Au moins 4 caractères",
      });
    }

    // Simulation : l'identifiant détermine le rôle du profil de démonstration.
    const lower = identifier.toLowerCase();
    const role: UserRole = lower.includes("admin")
      ? "admin"
      : lower.includes("prof") || lower.includes("enseignant") || lower.includes("agboton")
        ? "teacher"
        : "learner";

    const profile = this.overlayProfile(DEMO_PROFILES[role]);
    const session = buildDemoSession({ ...profile, email: identifier.includes("@") ? identifier : profile.email });
    demoStore.write(SESSION_KEY, session);
    demoStore.write(LOGGED_OUT_KEY, false);
    return session;
  }

  async register(input: RegisterInput): Promise<AuthSession> {
    await demoDelay(380);
    const fields: Record<string, string> = {};
    if (!input.prenom?.trim()) fields.prenom = "Le prénom est obligatoire";
    if (!input.nom?.trim()) fields.nom = "Le nom est obligatoire";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email ?? "")) fields.email = "Adresse e-mail invalide";
    if (!input.password || input.password.length < 8) fields.password = "8 caractères minimum";
    if (input.role === "learner" && !/^\d{8}$/.test(input.matricule ?? "")) {
      fields.matricule = "Le matricule UAC comporte 8 chiffres";
    }
    if (Object.keys(fields).length > 0) {
      throw ApiError.of("VALIDATION", "Le formulaire contient des erreurs.", fields);
    }

    const base = input.role === "teacher" ? DEMO_TEACHER : DEMO_LEARNER;
    const profile: UserProfile = {
      ...base,
      id: `demo-user-${Date.now().toString(36)}`,
      prenom: input.prenom.trim(),
      nom: input.nom.trim(),
      email: input.email.trim(),
      role: input.role,
      teacherStatus: input.role === "teacher" ? "pending" : "none",
      matricule: input.matricule,
      faculty: input.faculty,
      department: input.department ?? base.department,
      subjects: input.subjects ?? base.subjects,
      level: computeLevel(0),
      streakDays: 0,
      credits: 50,
      joinedAt: nowIso(),
    };

    const session = buildDemoSession(profile);
    demoStore.write(SESSION_KEY, session);
    demoStore.write(PROFILE_KEY, profile);
    demoStore.write(LOGGED_OUT_KEY, false);
    return session;
  }

  async logout(): Promise<void> {
    await demoDelay(120);
    demoStore.remove(SESSION_KEY);
    demoStore.write(LOGGED_OUT_KEY, true);
  }

  /** Bascule de rôle : outil de démonstration pour parcourir les trois espaces. */
  async switchDemoRole(role: UserRole): Promise<AuthSession> {
    await demoDelay(120);
    const session = buildDemoSession(this.overlayProfile(DEMO_PROFILES[role]));
    demoStore.write(SESSION_KEY, session);
    demoStore.write(LOGGED_OUT_KEY, false);
    return session;
  }

  async requestTeacherActivation(
    input: TeacherActivationInput,
  ): Promise<{ teacherStatus: TeacherStatus; message: string }> {
    await demoDelay(300);
    const fields: Record<string, string> = {};
    if (!/^\d{8}$/.test(input.matricule)) fields.matricule = "Matricule UAC invalide";
    if (!input.department?.trim()) fields.department = "Département obligatoire";
    if (!input.title?.trim()) fields.title = "Grade obligatoire";
    if (Object.keys(fields).length > 0) {
      throw ApiError.of("VALIDATION", "La demande est incomplète.", fields);
    }

    const current = await this.getSession();
    if (!current) throw ApiError.of("UNAUTHENTICATED", "Connectez-vous pour demander une activation.");

    // Toute demande reste « en attente » : la validation est un acte serveur.
    const updated: UserProfile = {
      ...current.user,
      role: "teacher",
      teacherStatus: "pending",
      matricule: input.matricule,
      faculty: input.faculty,
      department: input.department,
      title: input.title,
    };
    demoStore.write(SESSION_KEY, buildDemoSession(updated));
    demoStore.write(PROFILE_KEY, updated);

    return {
      teacherStatus: "pending",
      message:
        "Demande enregistrée localement (démonstration). En production, le secrétariat académique valide le statut enseignant.",
    };
  }

  async updateProfile(input: ProfileUpdateInput): Promise<UserProfile> {
    await demoDelay(200);
    const current = await this.getSession();
    if (!current) throw ApiError.of("UNAUTHENTICATED", "Aucune session active.");
    const updated: UserProfile = { ...current.user, ...input };
    demoStore.write(SESSION_KEY, buildDemoSession(updated));
    demoStore.write(PROFILE_KEY, updated);
    return updated;
  }

  /** Applique une éventuelle surcharge de profil (crédits, XP) stockée localement. */
  private overlayProfile(base: UserProfile): UserProfile {
    const stored = demoStore.read<UserProfile | null>(PROFILE_KEY, null);
    if (!stored || stored.id !== base.id) return base;
    return { ...base, ...stored };
  }

  /** Utilitaire de test : remet la démonstration à zéro. */
  resetDemo(): void {
    demoStore.remove(SESSION_KEY);
    demoStore.remove(PROFILE_KEY);
    demoStore.remove(LOGGED_OUT_KEY);
  }
}

export const authService = new AuthService();
