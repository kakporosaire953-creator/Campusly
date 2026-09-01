with open('contribuer.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { requireAuth } from './js/auth-guard.js';", "import { authService } from './js/services/authService.js';")
content = content.replace("requireAuth((user) => {", "if (authService.protectRoute()) { const user = authService.getUser();")

with open('contribuer.html', 'w', encoding='utf-8') as f:
    f.write(content)
