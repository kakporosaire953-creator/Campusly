// ============================================================
// CAMPUSLY — dashboard.js (Supabase)
// ============================================================
import { supabase } from "./supabase-config.js";
import { requireAuth } from "./auth-guard.js";
import { getUserProfile, getDownloadHistory, getFavorites, getQuizResults, checkIsPremium } from "./supabase-db.js";

function showToast(msg, type = "info") {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.className = `toast ${type} show`;
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 3500);
}
window.showToast = showToast;

window.logout = async function() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
};

let _user = null, _profile = null;

requireAuth(async (user) => {
  _user    = user;
  _profile = await getUserProfile(user.id);
  if (!_profile) {
    showToast("Profil introuvable. Reconnectez-vous.", "info");
    setTimeout(() => window.location.href = "auth.html", 1500);
    return;
  }
  loadUserInfo();
  loadStats();
  loadHistory();
  loadFavorites();
  initSidebar();
  const hash = window.location.hash.replace("#", "");
  if (hash) showSection(hash);
});

function loadUserInfo() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ""; };
  const fullName = `${_profile.prenom || ""} ${_profile.nom || ""}`.trim() || _profile.matricule;
  set("userName",         fullName);
  set("userMatricule",    _profile.matricule);
  set("welcomeMsg",       `Bonjour, ${_profile.prenom || _profile.matricule} 👋`);
  set("profileName",      fullName);
  set("profileMatricule", _profile.matricule);
  set("profileFaculte",   _profile.faculte);
  set("profileDept",      _profile.departement);

  const navActions = document.getElementById("navActions");
  if (navActions) {
    navActions.innerHTML = `
      <span class="nav-user-name">${_profile.prenom || _profile.matricule}</span>
      ${checkIsPremium(_profile) ? '<span class="premium-badge">Premium</span>' : ""}
      <button onclick="logout()" class="btn btn-ghost btn-sm">Déconnexion</button>
    `;
  }

  const premium = checkIsPremium(_profile);
  const premiumEl = document.getElementById("premiumStatus");
  if (premiumEl) {
    if (premium) {
      const expiry = new Date(_profile.premium_expiry);
      premiumEl.innerHTML = `<span class="premium-badge">⭐ Premium actif jusqu'au ${expiry.toLocaleDateString("fr-FR")}</span>`;
    } else {
      premiumEl.innerHTML = `<span style="color:var(--text-3);font-size:0.85rem;">Compte gratuit</span>
        <a href="#" onclick="showSection('abonnement')" class="btn btn-accent btn-sm" style="margin-left:12px;">Passer Premium</a>`;
    }
  }
}

async function loadStats() {
  const [history, favorites, quizResults] = await Promise.all([
    getDownloadHistory(_user.id),
    getFavorites(_user.id),
    getQuizResults(_user.id),
  ]);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("statDownloads", history.length);
  set("statFavorites", favorites.length);
  set("statQuiz",      quizResults.length);
  set("statPremium",   checkIsPremium(_profile) ? "Actif" : "Inactif");
}

async function loadHistory() {
  const history = await getDownloadHistory(_user.id);
  const render  = (items, limit) => !items.length
    ? `<div class="empty-state" style="padding:24px 0;"><p>Aucun téléchargement.</p>
       <a href="epreuves.html" class="btn btn-primary btn-sm" style="margin-top:12px;">Consulter les épreuves</a></div>`
    : items.slice(0, limit).map(item => `
      <div class="history-row">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span class="history-row-title">${item.titre}</span>
        <span class="history-row-date">${new Date(item.created_at).toLocaleDateString("fr-FR")}</span>
      </div>`).join("");

  const preview = document.getElementById("historyPreview");
  const list    = document.getElementById("historyList");
  if (preview) preview.innerHTML = render(history, 3);
  if (list)    list.innerHTML    = render(history, 50);
}

async function loadFavorites() {
  const favIds    = await getFavorites(_user.id);
  const container = document.getElementById("favoritesList");
  if (!container) return;
  container.innerHTML = !favIds.length
    ? `<div class="empty-state"><div class="empty-icon">⭐</div><h3>Aucun favori</h3>
       <a href="epreuves.html" class="btn btn-primary btn-sm" style="margin-top:16px;">Parcourir les épreuves</a></div>`
    : favIds.map(id => `
      <div style="display:flex;align-items:center;gap:14px;padding:14px;background:var(--gray-100);border-radius:10px;margin-bottom:10px;">
        <div style="width:40px;height:40px;background:var(--accent-light);border-radius:10px;display:flex;align-items:center;justify-content:center;">⭐</div>
        <div style="flex:1;font-weight:600;font-size:0.9rem;">${id}</div>
        <a href="epreuves.html" class="btn btn-primary btn-sm">Voir</a>
      </div>`).join("");
}

function initSidebar() {
  document.querySelectorAll(".sidebar-link[data-section]").forEach(link => {
    link.addEventListener("click", e => { e.preventDefault(); showSection(link.dataset.section); });
  });
  const hamburger = document.getElementById("sidebarToggle");
  const sidebar   = document.querySelector(".sidebar");
  const overlay   = document.getElementById("sidebarOverlay");
  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      overlay?.classList.toggle("show");
    });
  }
}

window.showSection = function(sectionId) {
  document.querySelectorAll(".dash-section").forEach(s => s.style.display = "none");
  const target = document.getElementById(`section-${sectionId}`);
  if (target) target.style.display = "block";
  document.querySelectorAll(".sidebar-link").forEach(l =>
    l.classList.toggle("active", l.dataset.section === sectionId));
  window.location.hash = sectionId;
};
