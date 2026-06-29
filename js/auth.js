// ============================================================
// CAMPUSLY — js/auth.js
// Authentification 100% Supabase (sans Firebase)
// ── Inscription · Connexion · Google OAuth · Déconnexion ────
// ============================================================

import { supabase } from "./supabase.js";
import { showToast, clearErrors } from "./utils.js";
import {
  validateMatricule,
  validatePassword,
  validateName,
  validateFaculty,
} from "./validators.js";
import {
  handleError,
  handleSupabaseResponse,
  AppError,
  ErrorType,
} from "./error-handler.js";

// ── Utilitaires ───────────────────────────────────────────────

/**
 * Convertit un matricule étudiant en adresse e-mail interne.
 * Si c'est déjà un e-mail, on le retourne tel quel.
 */
export function matriculeToEmail(matricule) {
  if (matricule.includes("@")) return matricule.toLowerCase().trim();
  return `${matricule
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._-]/g, "")}@campusly.app`;
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) { el.textContent = message; el.classList.add("show"); }
}

// ── Tabs UI ───────────────────────────────────────────────────

function initTabs() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("tab") === "register") switchTab("register");

  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });
}

window.switchTab = function switchTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.tab === tab)
  );
  document.getElementById("loginForm").style.display    = tab === "login"    ? "block" : "none";
  document.getElementById("registerForm").style.display = tab === "register" ? "block" : "none";
};

// ── Inscription ───────────────────────────────────────────────

async function handleRegister(e) {
  e.preventDefault();
  clearErrors();

  const prenom      = document.getElementById("regPrenom").value.trim();
  const nom         = document.getElementById("regNom").value.trim();
  const matricule   = document.getElementById("regMatricule").value.trim().toUpperCase();
  const faculte     = document.getElementById("regFaculte").value;
  const departement = document.getElementById("regDepartement").value.trim();
  const password    = document.getElementById("regPassword").value;
  const confirm     = document.getElementById("regConfirm").value;
  const btn         = document.getElementById("registerBtn");

  // Validation
  const prenomV = validateName(prenom, "Le prénom");
  if (!prenomV.valid) return showError("regPrenomError", prenomV.error);

  const nomV = validateName(nom, "Le nom");
  if (!nomV.valid) return showError("regNomError", nomV.error);

  const matriculeV = validateMatricule(matricule);
  if (!matriculeV.valid) return showError("regMatriculeError", matriculeV.error);

  const faculteV = validateFaculty(faculte);
  if (!faculteV.valid) return showError("regFaculteError", faculteV.error);

  const passwordV = validatePassword(password);
  if (!passwordV.valid) return showError("regPasswordError", passwordV.errors.join(" · "));

  if (password !== confirm) {
    return showError("regConfirmError", "Les mots de passe ne correspondent pas.");
  }

  btn.disabled    = true;
  btn.textContent = "Création du compte…";

  try {
    const email = matriculeToEmail(matricule);

    // 1. Créer le compte Supabase Auth
    //    Le trigger `handle_new_user` créera automatiquement le profil
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { prenom, nom, faculte, departement, matricule },
      },
    });

    if (error) {
      if (
        error.message.includes("already registered") ||
        error.message.includes("already been registered")
      ) {
        throw new AppError(
          ErrorType.VALIDATION,
          "Un compte existe déjà avec cet identifiant.",
          error
        );
      }
      throw error;
    }

    if (!data.user) {
      throw new AppError(ErrorType.SERVER, "Erreur lors de la création. Réessayez.", null);
    }

    showToast(`Compte créé ! Bienvenue, ${prenom} 🎉`, "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 900);

  } catch (err) {
    btn.disabled    = false;
    btn.textContent = "Créer mon compte";

    const appError = handleError(err, { showToUser: false });
    if (appError.type === ErrorType.VALIDATION) {
      showError("regMatriculeError", appError.message);
    } else {
      showError("regPasswordError", appError.message);
    }
  }
}

// ── Connexion ─────────────────────────────────────────────────

async function handleLogin(e) {
  e.preventDefault();
  clearErrors();

  const matricule = document.getElementById("loginMatricule").value.trim().toUpperCase();
  const password  = document.getElementById("loginPassword").value;
  const btn       = document.getElementById("loginBtn");

  const matriculeV = validateMatricule(matricule);
  if (!matriculeV.valid) return showError("loginMatriculeError", matriculeV.error);

  if (!password) return showError("loginPasswordError", "Veuillez entrer votre mot de passe.");

  btn.disabled    = true;
  btn.textContent = "Connexion en cours…";

  try {
    const email    = matriculeToEmail(matricule);
    const response = await supabase.auth.signInWithPassword({ email, password });
    handleSupabaseResponse(response);

    showToast("Connexion réussie !", "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 900);

  } catch (err) {
    btn.disabled    = false;
    btn.textContent = "Se connecter";

    handleError(err, { showToUser: false });
    showError("loginPasswordError", "Identifiants incorrects. Vérifiez votre matricule et mot de passe.");
  }
}

// ── Google OAuth (100% Supabase — plus de Firebase) ───────────

async function handleGoogle() {
  try {
    const redirectTo = `${window.location.origin}/auth.html`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt:      "consent",
        },
      },
    });

    if (error) throw error;
    // Supabase redirige automatiquement vers Google,
    // puis revient sur redirectTo avec le token dans l'URL.

  } catch (err) {
    handleError(err, {
      showToUser:    true,
      customMessage: "Connexion Google annulée ou bloquée.",
    });
  }
}

// ── Callback OAuth (traitement du retour Google) ──────────────

async function handleOAuthCallback() {
  // Supabase detectSessionInUrl: true gère l'échange automatiquement.
  // On attend juste que la session soit établie, puis on redirige.
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("[Auth] Erreur callback OAuth:", error.message);
    return;
  }

  if (session) {
    // Vérifier si le profil existe déjà (créé par trigger ou pas)
    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("id", session.user.id)
      .single();

    // Si le trigger n'a pas encore créé le profil, on le crée manuellement
    if (!profile) {
      const meta  = session.user.user_metadata || {};
      const email = session.user.email || "";
      await supabase.from("users").upsert({
        id:            session.user.id,
        matricule:     email.split("@")[0].toUpperCase().slice(0, 12),
        prenom:        meta.full_name?.split(" ")[0] || meta.name?.split(" ")[0] || "Étudiant",
        nom:           meta.full_name?.split(" ").slice(1).join(" ") || "",
        email,
        faculte:       "",
        departement:   "",
        is_premium:    false,
        photo_url:     meta.avatar_url || meta.picture || "",
        auth_provider: "google",
      }, { onConflict: "id" });
    }

    window.location.replace("dashboard.html");
  }
}

// ── Déconnexion (exportée pour usage global) ──────────────────

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "auth.html";
}

// ── Départements par faculté ──────────────────────────────────

const DEPARTEMENTS = {
  FASEG:  ["Économie","Gestion","Comptabilité et Finance","Marketing","Finance Quantitative & Microfinance","Économétrie et Statistiques appliquées"],
  FADESP: ["Droit Public","Droit Privé","Sciences Politiques"],
  FAST:   ["Mathématiques","Physique","Chimie","Sciences Naturelles","Géologie","Biotechnologie alimentaire","Physiologie"],
  FSS:    ["Médecine générale","Pharmacie","Odontostomatologie","Kinésithérapie","Nutrition et Diététique","Assistants sociaux"],
  FSA:    ["Production Végétale","Production Animale et Pêche","Nutrition & Sciences agro-alimentaires","Aménagement des Ressources naturelles","Conseil agricole"],
  FASHS:  ["Histoire & Archéologie","Géographie & Aménagement","Sociologie & Anthropologie","Philosophie","Psychologie","Sciences de l'éducation"],
  FLLAC:  ["Lettres Modernes","Sciences du Langage & Communication","Anglais","Allemand","Espagnol","Arts & Culture"],
  EPAC:   ["Génie Civil","Génie Électrique","Génie Mécanique","Architecture"],
  INJEPS: ["STAPS","Sciences de l'Éducation et de la Formation"],
  ENEAM:  ["Gestion des Entreprises","Statistiques","Informatique de Gestion"],
};

function initDepartements() {
  const faculteSelect = document.getElementById("regFaculte");
  const deptInput     = document.getElementById("regDepartement");
  const deptDatalist  = document.getElementById("deptList");
  if (!faculteSelect || !deptDatalist) return;

  faculteSelect.addEventListener("change", () => {
    const depts     = DEPARTEMENTS[faculteSelect.value] || [];
    deptDatalist.innerHTML = depts.map((d) => `<option value="${d}">`).join("");
    if (deptInput) deptInput.value = "";
  });
}

// ── Init ──────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  initTabs();
  initDepartements();

  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document.getElementById("registerForm")?.addEventListener("submit", handleRegister);
  document.getElementById("googleBtn")?.addEventListener("click", handleGoogle);

  // Traiter le callback OAuth si on revient de Google
  const hash   = window.location.hash;
  const params = new URLSearchParams(window.location.search);
  if (hash.includes("access_token") || params.get("code")) {
    await handleOAuthCallback();
    return;
  }

  // Si l'utilisateur est déjà connecté → dashboard
  const { data: { session } } = await supabase.auth.getSession();
  if (session) window.location.href = "dashboard.html";
});
