// ============================================================
// CAMPUSLY — app.js (Supabase)
// ============================================================
import { supabase } from "./supabase-config.js";

let _currentUser   = null;
let _userProfile   = null;

export function getCurrentUser()  { return _currentUser; }
export function getUserProfile()  { return _userProfile; }
export function isLoggedIn()      { return !!_currentUser; }

export function isPremium() {
  if (!_userProfile) return false;
  const expiry = _userProfile.premium_expiry ? new Date(_userProfile.premium_expiry) : null;
  return _userProfile.is_premium && expiry && expiry > new Date();
}

// ── Déconnexion ──────────────────────────────────────────────
export async function logout() {
  await supabase.auth.signOut();
  _currentUser = null;
  _userProfile = null;
  showToast("Vous avez été déconnecté.", "info");
  setTimeout(() => { window.location.href = "index.html"; }, 900);
}
window.logout = logout;

// ── Toast ────────────────────────────────────────────────────
window.showToast = function showToast(message, type = "info") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 3500);
};

// ── Navbar dynamique ─────────────────────────────────────────
function updateNavAuth() {
  const el = document.getElementById("navActions");
  if (!el) return;
  if (_currentUser && _userProfile) {
    el.innerHTML = `
      <span class="nav-user-name">${_userProfile.prenom || _userProfile.matricule}</span>
      ${isPremium() ? '<span class="premium-badge">Premium</span>' : ""}
      <a href="dashboard.html" class="btn btn-outline btn-sm">Dashboard</a>
      <button onclick="logout()" class="btn btn-sm btn-ghost-dark">Déconnexion</button>
    `;
  } else {
    el.innerHTML = `
      <a href="auth.html" class="btn btn-outline btn-sm">Connexion</a>
      <a href="auth.html?tab=register" class="btn btn-primary btn-sm">S'inscrire</a>
    `;
  }
}

// ── Modal ────────────────────────────────────────────────────
window.openModal  = (id) => document.getElementById(id)?.classList.add("show");
window.closeModal = (id) => document.getElementById(id)?.classList.remove("show");
document.addEventListener("click", e => {
  if (e.target.classList.contains("modal-overlay")) e.target.classList.remove("show");
});

// ── Animations scroll ────────────────────────────────────────
function initScrollAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity   = "1";
        en.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".feature-card, .pricing-card, .step-card").forEach(el => {
    el.style.opacity    = "0";
    el.style.transform  = "translateY(28px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    obs.observe(el);
  });
}

// ── Navbar scroll + hamburger ────────────────────────────────
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });
}
const hamburger = document.querySelector(".hamburger");
const navLinks  = document.querySelector(".nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    hamburger.classList.toggle("active");
  });
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const { data: { session } } = await supabase.auth.getSession();
  _currentUser = session?.user ?? null;

  if (_currentUser) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", _currentUser.id)
      .single();
    _userProfile = data;
  }

  updateNavAuth();
  initScrollAnimations();

  document.dispatchEvent(new CustomEvent("authReady", {
    detail: { user: _currentUser, profile: _userProfile }
  }));

  // Écouter les changements de session
  supabase.auth.onAuthStateChange(async (event, session) => {
    _currentUser = session?.user ?? null;
    if (_currentUser) {
      const { data } = await supabase.from("users").select("*").eq("id", _currentUser.id).single();
      _userProfile = data;
    } else {
      _userProfile = null;
    }
    updateNavAuth();
  });
});
