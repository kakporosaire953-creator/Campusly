with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

funcs = """
  window.openCorrectionModal = function() {
    document.getElementById('correctionModal').classList.add('show');
  };
  window.openStudentResultModal = function() {
    document.getElementById('studentResultModal').classList.add('show');
  };
"""

content = content.replace('window.toggleSidebar = function() {', funcs + '\n  window.toggleSidebar = function() {')

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)
