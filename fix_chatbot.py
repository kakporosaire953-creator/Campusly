with open('chatbot.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { requireAuth } from './js/auth-guard.js';", "import { authService } from './js/services/authService.js';")
content = content.replace("requireAuth(async (user) => {", "if (authService.protectRoute()) { const user = authService.getUser();")
content = content.replace("document.getElementById('userName').textContent = user.user_metadata?.prenom || 'Étudiant';", "document.getElementById('userName').textContent = user.prenom || 'Étudiant';")

with open('chatbot.html', 'w', encoding='utf-8') as f:
    f.write(content)
