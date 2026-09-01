with open('contribuer.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { initAutoLogout } from './js/auto-logout.js';", "")
content = content.replace("initAutoLogout();", "")

with open('contribuer.html', 'w', encoding='utf-8') as f:
    f.write(content)
