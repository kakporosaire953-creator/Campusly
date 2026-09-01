import re

with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

composition_html = """
      <!-- VUE COMPOSITION -->
      <div id="view-composition" class="dash-view" style="display:none;">
        
        <!-- ==================== COTE PROFESSEUR ==================== -->
        <div id="teacherCompositionView" style="display:none;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
            <div>
              <h2 style="font-size:1.6rem;font-weight:900;color:var(--text-1);margin:0 0 6px;">Compositions & Évaluations</h2>
              <p style="font-size:0.95rem;color:var(--text-2);margin:0;">Gérez vos épreuves, générez des codes et analysez les résultats.</p>
            </div>
            <div style="display:flex;gap:12px;">
              <button class="btn btn-outline" onclick="alert('Module d\\'import (PDF, Doc) en cours de développement')">
                <i class="fas fa-file-import"></i> Importer
              </button>
              <button class="btn btn-primary" style="box-shadow: 0 4px 12px rgba(21,101,192,0.3);" onclick="document.getElementById('createCompModal').classList.add('show')">
                <i class="fas fa-plus"></i> Créer une composition
              </button>
            </div>
          </div>

          <!-- Liste des compositions -->
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-xl);padding:24px;">
            <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-1);margin:0 0 16px;">Mes compositions</h3>
            
            <div style="display:flex;flex-direction:column;gap:12px;">
              <!-- Composition En cours -->
              <div style="display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;flex-wrap:wrap;gap:16px;">
                <div style="display:flex;align-items:center;gap:16px;">
                  <div style="width:48px;height:48px;border-radius:12px;background:rgba(16,185,129,0.1);color:var(--success);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
                    <i class="fas fa-play"></i>
                  </div>
                  <div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                      <h4 style="font-size:1.05rem;font-weight:800;color:var(--text-1);margin:0;">Algorithmique Avancée</h4>
                      <span style="font-size:0.7rem;font-weight:800;background:rgba(16,185,129,0.1);color:var(--success);padding:2px 8px;border-radius:var(--r-full);">EN COURS</span>
                    </div>
                    <p style="font-size:0.85rem;color:var(--text-3);margin:0;">L2 Informatique • 60 min • 30 QCM</p>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:24px;">
                  <div style="text-align:center;">
                    <div style="font-size:1.2rem;font-weight:900;color:var(--text-1);">42/68</div>
                    <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;">Participants</div>
                  </div>
                  <div style="text-align:center;">
                    <div style="font-size:1.1rem;font-weight:800;color:var(--brand-1);font-family:var(--font-mono);letter-spacing:1px;background:var(--surface-2);padding:4px 12px;border-radius:var(--r-md);cursor:pointer;" onclick="navigator.clipboard.writeText('CMP-7K4P92');alert('Code copié !')">CMP-7K4P92 <i class="fas fa-copy" style="font-size:0.8rem;margin-left:4px;color:var(--text-3);"></i></div>
                    <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;margin-top:4px;">Code d'accès</div>
                  </div>
                  <button class="btn btn-outline btn-sm" onclick="alert('Suivi en direct ouvert')">Suivre en direct</button>
                </div>
              </div>

              <!-- Composition Programmée -->
              <div style="display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;flex-wrap:wrap;gap:16px;">
                <div style="display:flex;align-items:center;gap:16px;">
                  <div style="width:48px;height:48px;border-radius:12px;background:rgba(21,101,192,0.1);color:var(--brand-1);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
                    <i class="fas fa-calendar-alt"></i>
                  </div>
                  <div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                      <h4 style="font-size:1.05rem;font-weight:800;color:var(--text-1);margin:0;">Bases de Données Relationnelles</h4>
                      <span style="font-size:0.7rem;font-weight:800;background:rgba(21,101,192,0.1);color:var(--brand-1);padding:2px 8px;border-radius:var(--r-full);">PROGRAMMÉE</span>
                    </div>
                    <p style="font-size:0.85rem;color:var(--text-3);margin:0;">L2 Informatique • Le 14 Sept à 10:00 • 90 min</p>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:24px;">
                  <div style="text-align:center;opacity:0.5;">
                    <div style="font-size:1.2rem;font-weight:900;color:var(--text-1);">-</div>
                    <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;">Participants</div>
                  </div>
                  <div style="text-align:center;">
                    <div style="font-size:1.1rem;font-weight:800;color:var(--brand-1);font-family:var(--font-mono);letter-spacing:1px;background:var(--surface-2);padding:4px 12px;border-radius:var(--r-md);cursor:pointer;" onclick="navigator.clipboard.writeText('CMP-BD2026');alert('Code copié !')">CMP-BD2026 <i class="fas fa-copy" style="font-size:0.8rem;margin-left:4px;color:var(--text-3);"></i></div>
                    <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;margin-top:4px;">Code d'accès</div>
                  </div>
                  <button class="btn btn-outline btn-sm">Modifier</button>
                </div>
              </div>

              <!-- Composition Terminée -->
              <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;flex-wrap:wrap;gap:16px;">
                <div style="display:flex;align-items:center;gap:16px;opacity:0.8;">
                  <div style="width:48px;height:48px;border-radius:12px;background:rgba(100,116,139,0.1);color:var(--text-3);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
                    <i class="fas fa-check-circle"></i>
                  </div>
                  <div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                      <h4 style="font-size:1.05rem;font-weight:800;color:var(--text-1);margin:0;">Systèmes d'Exploitation</h4>
                      <span style="font-size:0.7rem;font-weight:800;background:rgba(100,116,139,0.1);color:var(--text-3);padding:2px 8px;border-radius:var(--r-full);">TERMINÉE</span>
                    </div>
                    <p style="font-size:0.85rem;color:var(--text-3);margin:0;">L2 Informatique • 120 min • Moyenne: 14.2/20</p>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:24px;">
                  <div style="text-align:center;">
                    <div style="font-size:1.2rem;font-weight:900;color:var(--text-1);">65/68</div>
                    <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;">Copies reçues</div>
                  </div>
                  <button class="btn btn-outline btn-sm" style="color:var(--text-1);">Analyser les résultats</button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- ==================== COTE ETUDIANT ==================== -->
        <div id="learnerCompositionView" style="display:none;height:100%;">
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;text-align:center;min-height:60vh;">
            <div style="width:80px;height:80px;background:rgba(21,101,192,0.1);color:var(--brand-1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin-bottom:24px;">
              <i class="fas fa-stopwatch"></i>
            </div>
            <h2 style="font-size:2rem;font-weight:900;color:var(--text-1);margin:0 0 12px;">Rejoindre une composition</h2>
            <p style="font-size:1rem;color:var(--text-2);margin:0 0 32px;max-width:400px;">
              Entrez le code unique fourni par votre professeur pour accéder à la salle d'attente de votre évaluation.
            </p>
            
            <form id="joinCompForm" style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:320px;" onsubmit="handleJoinComposition(event)">
              <div style="position:relative;">
                <i class="fas fa-key" style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--text-3);"></i>
                <input type="text" id="compCodeInput" placeholder="Ex: CMP-7K4P92" style="width:100%;background:#fff;border:2px solid var(--border-2);border-radius:var(--r-lg);padding:14px 14px 14px 44px;font-family:var(--font-mono);font-size:1.2rem;font-weight:800;color:var(--text-1);text-transform:uppercase;letter-spacing:1px;transition:all 0.2s;text-align:center;" required />
              </div>
              <button type="submit" class="btn btn-primary" style="padding:14px;font-size:1.05rem;border-radius:var(--r-lg);box-shadow:0 4px 12px rgba(21,101,192,0.25);">
                Continuer <i class="fas fa-arrow-right" style="margin-left:8px;"></i>
              </button>
            </form>
            
            <p id="joinCompError" style="color:var(--danger);font-size:0.85rem;font-weight:700;margin-top:16px;display:none;">
              Code introuvable. Vérifiez le code fourni par votre professeur.
            </p>
          </div>
        </div>

      </div>
"""

# Insert the new view right after view-classrooms
pattern = re.compile(r'(<!-- VUE CLASSROOMS -->.*?</div>\s*</div>)', re.DOTALL)
content = pattern.sub(r'\1\n' + composition_html, content)

# Update the display logic in renderDashboard
display_logic = """
    document.getElementById('teacherCompositionView').style.display = isTeacher ? 'block' : 'none';
    document.getElementById('learnerCompositionView').style.display = isTeacher ? 'none' : 'block';
"""
content = content.replace("document.getElementById('teacherClassroomActions').style.display = isTeacher ? 'flex' : 'none';", 
                          "document.getElementById('teacherClassroomActions').style.display = isTeacher ? 'flex' : 'none';\n" + display_logic)

# Add the handleJoinComposition function
js_logic = """
  window.handleJoinComposition = function(e) {
    e.preventDefault();
    const code = document.getElementById('compCodeInput').value.trim().toUpperCase();
    const errorEl = document.getElementById('joinCompError');
    errorEl.style.display = 'none';
    
    if (code.length < 5) {
      errorEl.textContent = "Code invalide. Veuillez entrer un code complet.";
      errorEl.style.display = 'block';
      return;
    }
    
    // Simuler une vérification backend
    if (code !== 'CMP-7K4P92' && code !== 'TEST26') {
      errorEl.textContent = "Code introuvable ou épreuve non ouverte. Vérifiez le code fourni.";
      errorEl.style.display = 'block';
      return;
    }
    
    // Code valide, redirection vers la salle d'attente de l'examen
    window.location.href = `exam-room.html?code=${code}`;
  };
"""
content = content.replace("window.navigateToView = function(viewId) {", js_logic + "\n  window.navigateToView = function(viewId) {")

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

