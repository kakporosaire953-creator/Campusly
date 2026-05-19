// ============================================================
// CAMPUSLY — auth.js (Supabase Auth)
// ============================================================
import { supabase } from "./supabase-config.js";

// ── Utilitaires ──────────────────────────────────────────────
export function matriculeToEmail(matricule) {
  // Accepte email direct ou convertit un identifiant en email
  if (matricule.includes('@')) return matricule.toLowerCase().trim();
  return `${matricule.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9._-]/g, "")}@campusly.app`;
}

export function validatePassword(password) {
  const rules = [
    { test: password.length >= 8,          msg: "Au moins 8 caractères" },
    { test: /[A-Z]/.test(password),        msg: "Au moins une lettre majuscule" },
    { test: /[0-9]/.test(password),        msg: "Au moins un chiffre" },
    { test: /[^A-Za-z0-9]/.test(password), msg: "Au moins un symbole (@, #, !, %…)" },
  ];
  const failed = rules.filter(r => !r.test);
  return failed.length === 0 ? null : failed.map(r => r.msg).join(" · ");
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) { el.textContent = message; el.classList.add("show"); }
}

function clearErrors() {
  document.querySelectorAll(".form-error").forEach(el => el.classList.remove("show"));
}

// ── Tabs ─────────────────────────────────────────────────────
function initTabs() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("tab") === "register") switchTab("register");
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });
}

window.switchTab = function switchTab(tab) {
  document.querySelectorAll(".auth-tab").forEach(t =>
    t.classList.toggle("active", t.dataset.tab === tab)
  );
  document.getElementById("loginForm").style.display    = tab === "login"    ? "block" : "none";
  document.getElementById("registerForm").style.display = tab === "register" ? "block" : "none";
};

// ── Inscription ──────────────────────────────────────────────
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

  if (!prenom)                         return showError("regPrenomError",    "Le prénom est requis.");
  if (!nom)                            return showError("regNomError",       "Le nom est requis.");
  if (!matricule) return showError("regMatriculeError", "L'identifiant est requis.");
  if (matricule.length < 3) return showError("regMatriculeError", "Identifiant trop court (min 3 caractères).");
  if (!faculte)                        return showError("regFaculteError",   "Veuillez sélectionner une faculté.");
  const pwError = validatePassword(password);
  if (pwError)                         return showError("regPasswordError",  pwError);
  if (password !== confirm)            return showError("regConfirmError",   "Les mots de passe ne correspondent pas.");

  btn.disabled = true;
  btn.textContent = "Création du compte…";

  const email = matriculeToEmail(matricule);

  // 1. Créer le compte Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { prenom, nom, faculte, departement, matricule }
    }
  });

  if (error) {
    btn.disabled = false;
    btn.textContent = "Créer mon compte";
    if (error.message.includes("already registered") || error.message.includes("already been registered")) {
      return showError("regMatriculeError", "Un compte existe déjà avec cet identifiant.");
    }
    return showError("regPasswordError", `Erreur : ${error.message}`);
  }

  if (!data.user) {
    btn.disabled = false;
    btn.textContent = "Créer mon compte";
    return showError("regPasswordError", "Erreur lors de la création. Réessayez.");
  }

  // 2. Créer le profil dans la table users
  const { error: profileError } = await supabase.from("users").upsert({
    id:          data.user.id,
    matricule:   matricule || data.user.id.slice(0, 8).toUpperCase(),
    prenom,
    nom,
    email,
    faculte,
    departement: departement || "",
    is_premium:  false,
  }, { onConflict: "id" });

  if (profileError) console.error("Erreur profil:", profileError);

  window.showToast?.(`Compte créé. Bienvenue, ${prenom} !`, "success");
  setTimeout(() => { window.location.href = "dashboard.html"; }, 900);
}

// ── Connexion ────────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  clearErrors();

  const matricule = document.getElementById("loginMatricule").value.trim().toUpperCase();
  const password  = document.getElementById("loginPassword").value;
  const btn       = document.getElementById("loginBtn");

  if (!matricule) return showError("loginMatriculeError", "Veuillez entrer votre identifiant.");
  if (!password)  return showError("loginPasswordError",  "Veuillez entrer votre mot de passe.");

  btn.disabled = true;
  btn.textContent = "Connexion en cours…";

  const email = matriculeToEmail(matricule);
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    btn.disabled = false;
    btn.textContent = "Se connecter";
    return showError("loginPasswordError", "Identifiants incorrects. Vérifiez votre matricule et mot de passe.");
  }

  window.showToast?.("Connexion réussie !", "success");
  setTimeout(() => { window.location.href = "dashboard.html"; }, 900);
}

// ── Google OAuth via Firebase ────────────────────────────────
async function handleGoogle() {
  try {
    const { auth, provider, signInWithPopup } = await import("./firebase-config.js");
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    // Récupérer les infos Google
    const email    = fbUser.email;
    const prenom   = fbUser.displayName?.split(" ")[0] || "";
    const nom      = fbUser.displayName?.split(" ").slice(1).join(" ") || "";
    const photoUrl = fbUser.photoURL || "";

    // Connecter dans Supabase avec l'email Google
    // On crée un mot de passe déterministe basé sur l'UID Firebase
    const password = `G_${fbUser.uid.slice(0, 16)}`;

    // Essayer de se connecter d'abord
    let { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      // Compte inexistant → créer
      const { data, error: signupError } = await supabase.auth.signUp({ email, password });
      if (signupError) {
        window.showToast?.("Erreur connexion Google. Réessayez.", "error");
        return;
      }
      // Créer le profil
      if (data.user) {
        await supabase.from("users").upsert({
          id:           data.user.id,
          matricule:    email.split("@")[0].toUpperCase().slice(0, 12),
          prenom,
          nom,
          email,
          faculte:      "",
          departement:  "",
          is_premium:   false,
          photo_url:    photoUrl,
          auth_provider: "google",
        }, { onConflict: "id" });
      }
    }

    window.showToast?.(`Bienvenue, ${prenom} !`, "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 900);

  } catch (err) {
    console.error("Erreur Google:", err);
    window.showToast?.("Connexion Google annulée ou bloquée.", "error");
  }
}

// ── Départements par faculté ─────────────────────────────────
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
    const depts = DEPARTEMENTS[faculteSelect.value] || [];
    deptDatalist.innerHTML = depts.map(d => `<option value="${d}">`).join("");
    if (deptInput) deptInput.value = "";
  });
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  initTabs();
  initDepartements();

  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document.getElementById("registerForm")?.addEventListener("submit", handleRegister);
  document.getElementById("googleBtn")?.addEventListener("click", handleGoogle);

  // Si déjà connecté → dashboard
  const { data: { session } } = await supabase.auth.getSession();
  if (session) window.location.href = "dashboard.html";
});
