with open('exam-room.html', 'r', encoding='utf-8') as f:
    content = f.read()

script_start = content.find("import { authService } from './js/services/authService.js';")
insert_pos = script_start + len("import { authService } from './js/services/authService.js';")

auth_check = "\n    if (!authService.protectRoute(['learner'])) return;\n"

content = content[:insert_pos] + auth_check + content[insert_pos:]

with open('exam-room.html', 'w', encoding='utf-8') as f:
    f.write(content)
