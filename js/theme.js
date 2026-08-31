(function() {
  var t = localStorage.getItem("campusly_theme") || "dark";
  document.documentElement.className = t === "light" ? "theme-light" : "";
})();

document.addEventListener("DOMContentLoaded", function() {
  function getThemeHtml(t) {
    return t === "light" 
      ? '<i class="fa-solid fa-moon" style="margin-right:5px;"></i> Sombre' 
      : '<i class="fa-solid fa-sun" style="margin-right:5px;color:#f59e0b;"></i> Clair';
  }

  function applyTheme(t) {
    document.documentElement.className = t === "light" ? "theme-light" : "";
    localStorage.setItem("campusly_theme", t);
    document.querySelectorAll(".theme-toggle-btn").forEach(function(b) {
      b.innerHTML = getThemeHtml(t);
    });
  }

  document.querySelectorAll("#langSwitcher").forEach(function(el) {
    if (el.previousElementSibling && el.previousElementSibling.classList.contains("theme-toggle-btn")) return;
    var btn = document.createElement("button");
    btn.className = "theme-toggle-btn";
    var cur = localStorage.getItem("campusly_theme") || "dark";
    btn.innerHTML = getThemeHtml(cur);
    btn.style.cssText = "display:inline-flex;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:4px 10px;cursor:pointer;font-size:0.75rem;font-weight:700;color:var(--text-2);white-space:nowrap;margin-right:6px;transition:all 0.2s;";
    btn.addEventListener("click", function() {
      var next = localStorage.getItem("campusly_theme") === "light" ? "dark" : "light";
      applyTheme(next);
    });
    el.parentNode.insertBefore(btn, el);
  });
});

  // --- Menu Hamburger Global ---
  var hamb = document.getElementById("hamburger");
  var navL = document.querySelector(".nav-links");
  if (hamb && navL) {
    hamb.addEventListener("click", function(e) {
      e.stopPropagation();
      var isOpen = navL.classList.toggle("open");
      hamb.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    
    document.addEventListener("click", function(e) {
      if (navL.classList.contains("open") && !navL.contains(e.target) && !hamb.contains(e.target)) {
        navL.classList.remove("open");
        hamb.classList.remove("open");
        document.body.style.overflow = "";
      }
    });

    navL.querySelectorAll("a").forEach(function(link) {
      link.addEventListener("click", function() {
        navL.classList.remove("open");
        hamb.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }
