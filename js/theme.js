(function() {
  var t = localStorage.getItem("campusly_theme") || "dark";
  document.documentElement.className = t === "light" ? "theme-light" : "";
})();

document.addEventListener("DOMContentLoaded", function() {
  function applyTheme(t) {
    document.documentElement.className = t === "light" ? "theme-light" : "";
    localStorage.setItem("campusly_theme", t);
    document.querySelectorAll(".theme-toggle-btn").forEach(function(b) {
      b.textContent = t === "light" ? "🌙 Sombre" : "☀️ Clair";
    });
  }

  document.querySelectorAll("#langSwitcher").forEach(function(el) {
    var btn = document.createElement("button");
    btn.className = "theme-toggle-btn";
    var cur = localStorage.getItem("campusly_theme") || "dark";
    btn.textContent = cur === "light" ? "🌙 Sombre" : "☀️ Clair";
    btn.style.cssText = "background:none;border:1px solid var(--border-2);border-radius:999px;padding:5px 12px;cursor:pointer;font-size:0.78rem;color:var(--text-2);white-space:nowrap;margin-right:6px;";
    btn.addEventListener("click", function() {
      var next = localStorage.getItem("campusly_theme") === "light" ? "dark" : "light";
      applyTheme(next);
    });
    el.parentNode.insertBefore(btn, el);
  });
});
