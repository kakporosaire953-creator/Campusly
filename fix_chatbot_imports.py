with open('chatbot.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { initAutoLogout } from './js/auto-logout.js';", "")
content = content.replace("import { showToast } from './js/utils.js';", "")
content = content.replace("import { handleError, retryWithBackoff } from './js/error-handler.js';", "")
content = content.replace("import { sanitizeHtml, escapeHtml } from './js/sanitizer.js';", "")
content = content.replace("initAutoLogout();", "")

helpers = """
  function showToast(msg, type="info") {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id="toast"; t.className="toast"; document.body.appendChild(t); }
    t.textContent = msg; t.className = `toast ${type} show`;
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 3500);
  }
  function escapeHtml(unsafe) {
    return (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function sanitizeHtml(html) { return escapeHtml(html); }
"""

script_tag = "import { authService } from './js/services/authService.js';"
content = content.replace(script_tag, script_tag + "\n" + helpers)

with open('chatbot.html', 'w', encoding='utf-8') as f:
    f.write(content)
