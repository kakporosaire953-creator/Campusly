// ============================================================
// CAMPUSLY — Logo avec chapeau de diplôme
// Injecte le logo sur toutes les pages via data-logo
// ============================================================

export const LOGO_SVG = `
<svg class="logo-cap" width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- Chapeau (mortarboard) -->
  <polygon points="16,4 30,11 16,18 2,11" fill="#1565C0"/>
  <path d="M16 18 L28 12.5 L28 21 Q28 25 16 28 Q4 25 4 21 L4 12.5 Z" fill="#1E88E5" opacity="0.9"/>
  <polygon points="16,4 30,11 16,18 2,11" fill="#1565C0"/>
  <!-- Dessus plat -->
  <rect x="13" y="3" width="6" height="2" rx="1" fill="#0D47A1"/>
  <!-- Cordon orange -->
  <line x1="28" y1="11" x2="28" y2="22" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
  <circle cx="28" cy="23" r="2.5" fill="#F57C00"/>
  <!-- Reflet -->
  <polygon points="16,4 30,11 22,14.5 8,7.5" fill="white" opacity="0.12"/>
</svg>`;

// Injecte le logo dans tous les éléments .logo-text
export function injectLogos() {
  document.querySelectorAll('.logo-text').forEach(el => {
    // Éviter la double injection
    if (el.querySelector('.logo-cap')) return;
    el.insertAdjacentHTML('afterbegin', LOGO_SVG);
  });
}

document.addEventListener('DOMContentLoaded', injectLogos);
