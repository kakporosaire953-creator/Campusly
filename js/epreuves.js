// ============================================================
// CAMPUSLY — epreuves.js (Supabase)
// ============================================================
import { supabase } from "./supabase-config.js";
import { requireAuth } from "./auth-guard.js";
import { getEpreuves, saveDownload, toggleFavorite, getFavorites } from "./supabase-db.js";
import { initLangSwitcher, applyTranslations } from "./i18n.js";
import { injectLogos } from "./logo.js";

let _user        = null;
let ALL_EPREUVES = [];
let favorites    = [];

// ── Données statiques de fallback ────────────────────────────
const STATIC_EPREUVES = [
  { id:"s1",  titre:"Microéconomie I",         faculte:"FASEG",  departement:"Économie",            semestre:"S1", annee:"2023", type:"Examen", is_premium:false },
  { id:"s2",  titre:"Macroéconomie II",         faculte:"FASEG",  departement:"Économie",            semestre:"S2", annee:"2023", type:"Examen", is_premium:false },
  { id:"s3",  titre:"Comptabilité Générale",    faculte:"FASEG",  departement:"Comptabilité",        semestre:"S1", annee:"2022", type:"Examen", is_premium:false },
  { id:"s4",  titre:"Finance Quantitative",     faculte:"FASEG",  departement:"Finance",             semestre:"S3", annee:"2023", type:"Examen", is_premium:true  },
  { id:"s5",  titre:"Droit Constitutionnel",    faculte:"FADESP", departement:"Droit Public",        semestre:"S1", annee:"2023", type:"Examen", is_premium:false },
  { id:"s6",  titre:"Droit Civil",              faculte:"FADESP", departement:"Droit Privé",         semestre:"S2", annee:"2023", type:"Examen", is_premium:false },
  { id:"s7",  titre:"Analyse Mathématique I",   faculte:"FAST",   departement:"Mathématiques",       semestre:"S1", annee:"2023", type:"Examen", is_premium:false },
  { id:"s8",  titre:"Algèbre Linéaire",         faculte:"FAST",   departement:"Mathématiques",       semestre:"S2", annee:"2023", type:"Examen", is_premium:false },
  { id:"s9",  titre:"Anatomie Générale",        faculte:"FSS",    departement:"Médecine générale",   semestre:"S1", annee:"2023", type:"Examen", is_premium:true  },
  { id:"s10", titre:"Agronomie Générale",       faculte:"FSA",    departement:"Production Végétale", semestre:"S1", annee:"2023", type:"Examen", is_premium:false },
  { id:"s11", titre:"Linguistique générale",    faculte:"FLLAC",  departement:"Sciences du Langage", semestre:"S1", annee:"2023", type:"Examen", is_premium:false },
  { id:"s12", titre:"Résistance des Matériaux", faculte:"EPAC",   departement:"Génie Civil",         semestre:"S3", annee:"2023", type:"Examen", is_premium:true  },
];

function showToast(msg, type = "info") {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.className = `toast ${type} show`;
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 3000);
}

requireAuth(async (user) => {
  _user = user;
  const navEl = document.getElementById("navActions");
  if (navEl) navEl.innerHTML = `<a href="dashboard.html" class="btn btn-ghost btn-sm">Dashboard</a>`;

  favorites = await getFavorites(user.id);
  await loadEpreuves();
});

async function loadEpreuves() {
  const grid = document.getElementById("epreuvesGrid");
  if (grid) grid.innerHTML = `<div class="ep-empty"><div class="ep-empty-icon" style="font-size:2rem;">⏳</div><p>Chargement...</p></div>`;

  try {
    const data = await getEpreuves();
    ALL_EPREUVES = data.length > 0 ? data : STATIC_EPREUVES;
  } catch (e) {
    ALL_EPREUVES = STATIC_EPREUVES;
  }

  const params = new URLSearchParams(window.location.search);
  const fac = params.get("faculte");
  if (fac) { const el = document.getElementById("filterFaculte"); if (el) el.value = fac; }
  applyFilters();
}

function applyFilters() {
  const search   = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const faculte  = document.getElementById("filterFaculte")?.value  || "";
  const semestre = document.getElementById("filterSemestre")?.value || "";
  const annee    = document.getElementById("filterAnnee")?.value    || "";

  const filtered = ALL_EPREUVES.filter(e =>
    (!search   || (e.titre||"").toLowerCase().includes(search) || (e.departement||"").toLowerCase().includes(search)) &&
    (!faculte  || e.faculte  === faculte)  &&
    (!semestre || e.semestre === semestre) &&
    (!annee    || String(e.annee) === annee)
  );

  const countEl = document.getElementById("epreuvesCount");
  if (countEl) countEl.textContent = `📚 ${filtered.length} épreuve${filtered.length > 1 ? "s" : ""}`;
  renderGrid(filtered);
}
window.applyFilters = applyFilters;

function renderGrid(list) {
  const grid = document.getElementById("epreuvesGrid");
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = `<div class="ep-empty"><div class="ep-empty-icon">🔍</div><h3>Aucune épreuve trouvée</h3><p>Essayez d'autres filtres.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(e => {
    const isFav = favorites.includes(String(e.id));
    const titre = (e.titre || "").replace(/'/g, "\\'");
    return `<div class="ep-card">
      <div class="ep-card-top">
        <div class="ep-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
        <div class="ep-badges">
          <span class="ep-badge ep-badge-faculte">${e.faculte||""}</span>
          <span class="ep-badge ep-badge-type">${e.type||""}</span>
          ${e.is_premium ? '<span class="ep-badge ep-badge-premium">⭐ Premium</span>' : ""}
        </div>
      </div>
      <div class="ep-title">${e.titre||""}</div>
      <div class="ep-meta"><span>📁 ${e.departement||""}</span><span>📅 ${e.annee||""}</span><span>📖 ${e.semestre||""}</span></div>
      <div class="ep-actions">
        ${e.is_premium
          ? `<button class="ep-btn-premium" onclick="showPremiumModal()">🔒 Débloquer</button>`
          : `<button class="ep-btn-dl" onclick="downloadEpreuve('${e.id}','${titre}','${e.file_url||""}','${e.faculte||""}','${e.annee||""}')">⬇ Télécharger</button>`
        }
        <button class="ep-btn-fav ${isFav ? "active" : ""}" onclick="toggleFav('${e.id}',this)" title="Favori">${isFav ? "⭐" : "☆"}</button>
      </div>
    </div>`;
  }).join("");
}

window.showPremiumModal = () => document.getElementById("premiumModal")?.classList.add("show");

window.downloadEpreuve = async (id, titre, fileUrl, faculte, annee) => {
  if (fileUrl) window.open(fileUrl, "_blank");
  else showToast(`Fichier non disponible pour : ${titre}`, "info");
  if (_user) {
    try { await saveDownload(_user.id, { id, titre, faculte, annee }); } catch (e) {}
  }
  if (fileUrl) showToast(`Téléchargement : ${titre}`, "success");
};

window.toggleFav = async (id, btn) => {
  const isFav = favorites.includes(String(id));
  if (isFav) {
    favorites = favorites.filter(f => f !== String(id));
    btn.classList.remove("active"); btn.textContent = "☆";
    showToast("Retiré des favoris", "info");
  } else {
    favorites.push(String(id));
    btn.classList.add("active"); btn.textContent = "⭐";
    showToast("Ajouté aux favoris", "success");
  }
  if (_user) {
    try { await toggleFavorite(_user.id, id, !isFav); } catch (e) {}
  }
};

document.getElementById("searchInput")?.addEventListener("input", applyFilters);
document.getElementById("filterFaculte")?.addEventListener("change", applyFilters);
document.getElementById("filterSemestre")?.addEventListener("change", applyFilters);
document.getElementById("filterAnnee")?.addEventListener("change", applyFilters);
document.getElementById("resetFilters")?.addEventListener("click", () => {
  ["searchInput","filterFaculte","filterSemestre","filterAnnee"].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = "";
  });
  applyFilters();
});

window.addEventListener("scroll", () => document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 20));
document.getElementById("hamburger")?.addEventListener("click", () => document.querySelector(".nav-links")?.classList.toggle("open"));
initLangSwitcher(); applyTranslations(); injectLogos();
