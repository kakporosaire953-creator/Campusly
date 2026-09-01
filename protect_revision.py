with open('revision.html', 'r', encoding='utf-8') as f:
    content = f.read()

script_start = content.find("import { CampuslyAIWizard } from './js/campusly-ai.js';")

auth_imports = """    import { authService } from './js/services/authService.js';
"""
auth_check = """
      if (!authService.protectRoute(['learner'])) return;
"""

if "import { authService } from" not in content:
    content = content[:script_start] + auth_imports + content[script_start:]

dom_ready = content.find("document.addEventListener('DOMContentLoaded', async () => {")
insert_pos = content.find("{", dom_ready) + 1

if "authService.protectRoute" not in content:
    content = content[:insert_pos] + auth_check + content[insert_pos:]

with open('revision.html', 'w', encoding='utf-8') as f:
    f.write(content)
