const fs = require('fs');
const files = [
  'admin.html', 'chatbot.html', 'contribuer.html', 'dashboard.html', 
  'forum.html', 'index.html', 'revision.html', 'auth.html', 'epreuves.html',
  'js/app.js', 'js/auto-logout.js', 'js/chatbot-secure.js', 
  'js/dashboard.js', 'js/epreuves.js', 'js/revision.js'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/supabase-config\.js/g, 'supabase.js');
  content = content.replace(/supabase-db\.js/g, 'db.js');
  content = content.replace(/SUPABASE_FUNCTIONS_URL/g, 'FUNCTIONS_URL');
  fs.writeFileSync(f, content, 'utf8');
});
console.log('Fixed imports safely!');
