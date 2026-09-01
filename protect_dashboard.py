with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add auth check at the very beginning of module script
script_start = content.find('<script type="module">')
imports_end = content.find("window.handleJoinComposition", script_start)

# We want to insert just before window.handleJoinComposition
auth_check = """
  if (!authService.protectRoute()) return;
  
"""

content = content[:imports_end] + auth_check + content[imports_end:]

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)
