with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

learner_banner = """
        <!-- BANNIERE DECOUVERTE COMPOSITIONS (PROVISOIRE) -->
        <div style="background: linear-gradient(135deg, rgba(21,101,192,0.1) 0%, rgba(21,101,192,0.05) 100%); border: 1px solid var(--brand-1); border-radius: var(--r-xl); padding: 24px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="margin: 0 0 8px 0; font-size: 1.2rem; color: var(--brand-1); font-weight: 800;"><i class="fa-solid fa-stopwatch" style="margin-right: 8px;"></i>Nouveau : Module de Compositions</h3>
            <p style="margin: 0; color: var(--text-2); font-size: 0.95rem;">Accédez à vos examens, validez les consignes de sécurité, et composez dans un environnement concentré.</p>
          </div>
          <button class="btn btn-primary" onclick="window.navigateToView('composition')">Découvrir l'interface Étudiant</button>
        </div>
"""

# Inject into learnerView
content = content.replace('<div id="learnerView">', '<div id="learnerView">\n' + learner_banner)

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)
