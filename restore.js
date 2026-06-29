const https = require('https');
const fs    = require('fs');

const files = [
  'dashboard.html', 'forum.html', 'chatbot.html', 'contribuer.html',
  'revision.html', 'admin.html', 'epreuves.html', 'index.html',
  'js/app.js', 'js/dashboard.js', 'js/epreuves.js', 'js/revision.js',
  'js/auto-logout.js', 'js/chatbot-secure.js'
];

// Commit propre avant la corruption (juste avant le commit 331b054)
const REF  = 'b3ebff4';
const REPO = 'kakporosaire953-creator/Campusly';

let done = 0;

files.forEach(file => {
  const rawUrl = 'https://raw.githubusercontent.com/' + REPO + '/' + REF + '/' + file;
  https.get(rawUrl, { headers: { 'User-Agent': 'node' } }, res => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      if (res.statusCode === 200) {
        const buf = Buffer.concat(chunks);
        // Créer le dossier si nécessaire
        if (file.includes('/')) {
          const dir = file.split('/').slice(0, -1).join('/');
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        }
        // Écrire en binaire (préserve l'encodage exact du serveur = UTF-8)
        fs.writeFileSync(file, buf);
        console.log('OK:', file);
      } else {
        console.log('SKIP (' + res.statusCode + '):', file);
      }
      done++;
      if (done === files.length) {
        console.log('\nTERMINE ! Maintenant corriger les imports...');
        // Corriger les imports supabase-config -> supabase et supabase-db -> db
        files.forEach(f => {
          let content = fs.readFileSync(f, 'utf8');
          content = content.replace(/supabase-config\.js/g, 'supabase.js');
          content = content.replace(/supabase-db\.js/g, 'db.js');
          content = content.replace(/SUPABASE_FUNCTIONS_URL/g, 'FUNCTIONS_URL');
          fs.writeFileSync(f, content, 'utf8');
        });
        console.log('Imports corriges !');
      }
    });
  }).on('error', e => {
    console.log('ERR:', file, e.message);
    done++;
  });
});
