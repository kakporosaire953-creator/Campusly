with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

learner_comp_start = content.find('<div id="learnerCompositionView" style="display:none;height:100%;">')
join_comp_form_end = content.find('</form>', learner_comp_start)
join_comp_error_end = content.find('</p>', join_comp_form_end) + 4

learner_recent_evals = """
            <div style="width: 100%; max-width: 800px; margin-top: 40px; text-align: left;">
              <h3 style="font-size:1.4rem;font-weight:900;color:var(--text-1);margin:0 0 16px;">Mes Évaluations Récentes</h3>
              
              <div style="display:flex;flex-direction:column;gap:12px;">
                <!-- En attente de correction -->
                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
                  <div style="display:flex;align-items:center;gap:16px;">
                    <div style="width:48px;height:48px;border-radius:12px;background:rgba(245,124,0,0.1);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
                      <i class="fas fa-hourglass-half"></i>
                    </div>
                    <div>
                      <h4 style="font-size:1.05rem;font-weight:800;color:var(--text-1);margin:0 0 4px;">Algorithmique Avancée</h4>
                      <p style="font-size:0.85rem;color:var(--text-3);margin:0;">Soumis le 12 Sept • Dr. K. AGBOTON</p>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:16px;">
                    <div style="text-align:right;">
                      <div style="font-size:0.9rem;font-weight:800;color:var(--accent);">Correction en attente</div>
                      <div style="font-size:0.75rem;color:var(--text-2);max-width:200px;">Le résultat sera disponible après validation par le professeur.</div>
                    </div>
                    <button class="btn btn-outline btn-sm" disabled style="opacity:0.5;cursor:not-allowed;">Voir mon résultat</button>
                  </div>
                </div>

                <!-- Résultat publié -->
                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
                  <div style="display:flex;align-items:center;gap:16px;">
                    <div style="width:48px;height:48px;border-radius:12px;background:rgba(16,185,129,0.1);color:var(--success);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
                      <i class="fas fa-award"></i>
                    </div>
                    <div>
                      <h4 style="font-size:1.05rem;font-weight:800;color:var(--text-1);margin:0 0 4px;">Réseaux Informatiques</h4>
                      <p style="font-size:0.85rem;color:var(--text-3);margin:0;">Publié le 10 Sept • Prof. R. MENSAH</p>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:16px;">
                    <div style="text-align:right;">
                      <div style="font-size:0.9rem;font-weight:800;color:var(--success);">Résultat publié</div>
                      <div style="font-size:0.75rem;color:var(--text-2);">Votre résultat est maintenant disponible.</div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openStudentResultModal()">Voir mon résultat</button>
                  </div>
                </div>
              </div>
            </div>
"""

content = content[:join_comp_error_end] + learner_recent_evals + content[join_comp_error_end:]

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

