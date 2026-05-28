// ============================================================
// CAMPUSLY — auth.js (Supabase Auth) - REFACTORÉ
// ============================================================
import { supabase } from "./supabase-config.js";
import { showToast, clearErrors } from "./utils.js";
import { validateMatricule, validatePassword, validateName, validateFaculty } from "./validators.js";
import { handleError, handleSupabaseResponse, AppError, ErrorType } from "./error-handler.js";

// ── Utilitaires ──────────────────────────────────────────────
export function matriculeToEmail(matricule) {
  // Accepte email direct ou convertit un identifiant en email
  if (matricule.includes('@')) return matricule.toLowerCase().trim();
  return `${matricule.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9._-]/g, "")}@campusly.app`;
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) { el.textContent = message; el.classList.add("show"); }
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

  // Validation avec les nouveaux validators
  const prenomValidation = validateName(prenom, "Le prénom");
  if (!prenomValidation.valid) return showError("regPrenomError", prenomValidation.error);
  
  const nomValidation = validateName(nom, "Le nom");
  if (!nomValidation.valid) return showError("regNomError", nomValidation.error);
  
  const matriculeValidation = validateMatricule(matricule);
  if (!matriculeValidation.valid) return showError("regMatriculeError", matriculeValidation.error);
  
  const faculteValidation = validateFaculty(faculte);
  if (!faculteValidation.valid) return showError("regFaculteError", faculteValidation.error);
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return showError("regPasswordError", passwordValidation.errors.join(" · "));
  }
  
  if (password !== confirm) {
    return showError("regConfirmError", "Les mots de passe ne correspondent pas.");
  }

  btn.disabled = true;
  btn.textContent = "Création du compte…";

  try {
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
      if (error.message.includes("already registered") || error.message.includes("already been registered")) {
        throw new AppError(ErrorType.VALIDATION, "Un compte existe déjà avec cet identifiant.", error);
      }
      throw error;
    }

    if (!data.user) {
      throw new AppError(ErrorType.SERVER, "Erreur lors de la création. Réessayez.", null);
    }

    // 2. Créer le profil dans la table users
    const profileResponse = await supabase.from("users").upsert({
      id:          data.user.id,
      matricule:   matricule || data.user.id.slice(0, 8).toUpperCase(),
      prenom,
      nom,
      email,
      faculte,
      departement: departement || "",
      is_premium:  false,
    }, { onConflict: "id" });

    handleSupabaseResponse(profileResponse);

    showToast(`Compte créé. Bienvenue, ${prenom} !`, "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 900);

  } catch (error) {
    btn.disabled = false;
    btn.textContent = "Créer mon compte";
    
    const appError = handleError(error, { showToUser: false });
    
    if (appError.type === ErrorType.VALIDATION) {
      showError("regMatriculeError", appError.message);
    } else {
      showError("regPasswordError", appError.message);
    }
  }
}

// ── Connexion ────────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  clearErrors();

  const matricule = document.getElementById("loginMatricule").value.trim().toUpperCase();
  const password  = document.getElementById("loginPassword").value;
  const btn       = document.getElementById("loginBtn");

  // Validation
  const matriculeValidation = validateMatricule(matricule);
  if (!matriculeValidation.valid) {
    return showError("loginMatriculeError", matriculeValidation.error);
  }
  
  if (!password) {
    return showError("loginPasswordError", "Veuillez entrer votre mot de passe.");
  }

  btn.disabled = true;
  btn.textContent = "Connexion en cours…";

  try {
    const email = matriculeToEmail(matricule);
    const response = await supabase.auth.signInWithPassword({ email, password });
    
    handleSupabaseResponse(response);

    showToast("Connexion réussie !", "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 900);

  } catch (error) {
    btn.disabled = false;
    btn.textContent = "Se connecter";
    
    handleError(error, { showToUser: false });
    showError("loginPasswordError", "Identifiants incorrects. Vérifiez votre matricule et mot de passe.");
  }
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
      const signupResponse = await supabase.auth.signUp({ email, password });
      handleSupabaseResponse(signupResponse);
      
      // Créer le profil
      if (signupResponse.data.user) {
        const profileResponse = await supabase.from("users").upsert({
          id:           signupResponse.data.user.id,
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
        
        handleSupabaseResponse(profileResponse);
      }
    }

    showToast(`Bienvenue, ${prenom} !`, "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 900);

  } catch (error) {
    handleError(error, { 
      showToUser: true,
      customMessage: "Connexion Google annulée ou bloquée."
    });
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
