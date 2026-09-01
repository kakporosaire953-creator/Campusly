with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('<!-- Composition Terminée -->')
end_idx = content.find('            </div>', start_idx)

new_cards = """<!-- Composition à Corriger -->
              <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;flex-wrap:wrap;gap:16px;">
                <div style="display:flex;align-items:center;gap:16px;">
                  <div style="width:48px;height:48px;border-radius:12px;background:rgba(245,124,0,0.1);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
                    <i class="fas fa-file-signature"></i>
                  </div>
                  <div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                      <h4 style="font-size:1.05rem;font-weight:800;color:var(--text-1);margin:0;">Systèmes d'Exploitation</h4>
                      <span style="font-size:0.7rem;font-weight:800;background:rgba(245,124,0,0.1);color:var(--accent);padding:2px 8px;border-radius:var(--r-full);">CORRECTION EN COURS</span>
                    </div>
                    <p style="font-size:0.85rem;color:var(--text-3);margin:0;">L2 Informatique • 120 min</p>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:24px;">
                  <div style="display:flex;gap:16px;text-align:center;">
                    <div>
                      <div style="font-size:1.2rem;font-weight:900;color:var(--text-1);">65</div>
                      <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;">Reçues</div>
                    </div>
                    <div>
                      <div style="font-size:1.2rem;font-weight:900;color:var(--accent);">15</div>
                      <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;">À corriger</div>
                    </div>
                    <div>
                      <div style="font-size:1.2rem;font-weight:900;color:var(--success);">50</div>
                      <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;">Validées</div>
                    </div>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="openCorrectionModal()">Corriger les copies</button>
                </div>
              </div>
              
              <!-- Composition Terminée et Publiée -->
              <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;flex-wrap:wrap;gap:16px;opacity:0.8;">
                <div style="display:flex;align-items:center;gap:16px;">
                  <div style="width:48px;height:48px;border-radius:12px;background:rgba(16,185,129,0.1);color:var(--success);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
                    <i class="fas fa-check-double"></i>
                  </div>
                  <div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                      <h4 style="font-size:1.05rem;font-weight:800;color:var(--text-1);margin:0;">Réseaux Informatiques</h4>
                      <span style="font-size:0.7rem;font-weight:800;background:rgba(16,185,129,0.1);color:var(--success);padding:2px 8px;border-radius:var(--r-full);">RÉSULTATS PUBLIÉS</span>
                    </div>
                    <p style="font-size:0.85rem;color:var(--text-3);margin:0;">L2 Informatique • Moyenne: 14.5/20</p>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:24px;">
                  <div style="text-align:center;">
                    <div style="font-size:1.2rem;font-weight:900;color:var(--text-1);">68/68</div>
                    <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;">Publiées</div>
                  </div>
                  <button class="btn btn-outline btn-sm">Voir les statistiques</button>
                </div>
              </div>"""

content = content[:start_idx] + new_cards + content[end_idx:]

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

