(function() {
  document.documentElement.className = "theme-light";
})();

document.addEventListener("DOMContentLoaded", function() {
  
  // --- Menu Hamburger Global ---
  var hamb = document.getElementById("hamburger");
  var navL = document.querySelector(".nav-links");
  var overlay = document.querySelector(".mobile-overlay");
  
  if (!overlay && navL) {
    overlay = document.createElement("div");
    overlay.className = "mobile-overlay";
    document.body.appendChild(overlay);
  }

  if (hamb && navL) {
    hamb.addEventListener("click", function(e) {
      e.stopPropagation();
      var isOpen = navL.classList.toggle("open");
      hamb.classList.toggle("open", isOpen);
      if (overlay) overlay.classList.toggle("show", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    
    document.addEventListener("click", function(e) {
      if (navL.classList.contains("open") && !navL.contains(e.target) && !hamb.contains(e.target)) {
        navL.classList.remove("open");
        hamb.classList.remove("open");
        if (overlay) overlay.classList.remove("show");
        document.body.style.overflow = "";
      }
    });

    navL.querySelectorAll("a").forEach(function(link) {
      link.addEventListener("click", function() {
        navL.classList.remove("open");
        hamb.classList.remove("open");
        if (overlay) overlay.classList.remove("show");
        document.body.style.overflow = "";
      });
    });
  }

  
  // Inject mobile auth actions if navbar exists
  if (navL && !document.querySelector(".nav-mobile-actions")) {
    const li = document.createElement("li");
    li.className = "nav-mobile-actions";
    li.innerHTML = `
      <div class="nav-guest-only" style="display:none; flex-direction:column; gap:8px; margin-top:16px;">
        <a href="auth.html" class="btn btn-ghost" style="width:100%; justify-content:center;">Connexion</a>
        <a href="auth.html?tab=register" class="btn btn-primary" style="width:100%; justify-content:center;">S\x27inscrire</a>
      </div>
      <div class="nav-auth-only" style="display:none; flex-direction:column; gap:8px; margin-top:16px;">
        <button id="mobileLogoutBtn" class="btn btn-ghost" style="width:100%; justify-content:center;">Déconnexion</button>
      </div>
    `;
    navL.appendChild(li);

    const checkAuth = () => {
      const isAuth = localStorage.getItem("campusly_auth_user");
      const isLoggedOut = localStorage.getItem("campusly_user_logged_out");
      const loggedIn = isAuth && isLoggedOut !== "true";
      
      li.querySelector(".nav-guest-only").style.display = loggedIn ? "none" : "flex";
      li.querySelector(".nav-auth-only").style.display = loggedIn ? "flex" : "none";
    };
    checkAuth();
    window.addEventListener("campusly_user_updated", checkAuth);

    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener("click", () => {
        localStorage.removeItem("campusly_auth_user");
        localStorage.setItem("campusly_user_logged_out", "true");
        window.location.reload();
      });
    }
  }


  // --- Injection globale du logo Campusly (Chapeau) ---
  var LOGO_SVG = `<svg class="logo-cap" width="1.15em" height="1.15em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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

  document.querySelectorAll('.logo-text').forEach(function(el) {
    if (el.querySelector('.logo-cap')) return;
    el.insertAdjacentHTML('afterbegin', LOGO_SVG);
  });
});
