with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Insert right before </body>
modals = """
  <!-- MODAL CORRECTION PROFESSEUR -->
  <div class="modal-overlay" id="correctionModal">
    <div class="modal-content" style="max-width:900px;">
      <div class="modal-header">
        <div>
          <h3 class="modal-title" style="margin-bottom:4px;">Correction Assistée : Systèmes d'Exploitation</h3>
          <p style="font-size:0.85rem;color:var(--text-3);margin:0;">L2 Informatique • 65 copies reçues • 15 à corriger</p>
        </div>
        <button class="modal-close" onclick="document.getElementById('correctionModal').classList.remove('show')"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body" style="max-height:70vh;overflow-y:auto;padding-right:12px;background:var(--bg-2);">
        
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
          <h4 style="font-size:1.1rem;font-weight:800;color:var(--text-1);margin:0;">Copie de : <span style="color:var(--brand-1);">Jean A.</span></h4>
          <div style="display:flex;gap:12px;">
            <button class="btn btn-outline btn-sm"><i class="fas fa-chevron-left"></i> Copie Précédente</button>
            <button class="btn btn-outline btn-sm">Copie Suivante <i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
        
        <!-- Q1 -->
        <div style="background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
            <div style="font-size:1rem;font-weight:800;color:var(--text-1);">Question 1 : Décrivez la différence entre un processus et un thread. (3 pts)</div>
            <span style="font-size:0.85rem;font-weight:700;color:var(--text-3);background:var(--surface);padding:4px 10px;border-radius:var(--r-md);">Q. Ouverte</span>
          </div>
          
          <div style="margin-bottom:16px;">
            <div style="font-size:0.85rem;color:var(--text-3);font-weight:600;margin-bottom:4px;">Réponse de l'étudiant :</div>
            <div style="background:var(--surface);padding:12px;border-radius:var(--r-md);font-size:0.95rem;color:var(--text-1);line-height:1.5;">
              Un processus a son propre espace mémoire indépendant, tandis que les threads partagent l'espace mémoire de leur processus parent.
            </div>
          </div>
          
          <div style="background:rgba(21,101,192,0.05);border:1px dashed var(--brand-1);border-radius:var(--r-md);padding:16px;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
              <i class="fas fa-robot" style="color:var(--brand-1);"></i>
              <span style="font-size:0.9rem;font-weight:800;color:var(--brand-1);">Analyse Campusly AI</span>
            </div>
            <p style="font-size:0.9rem;color:var(--text-2);margin:0 0 12px;line-height:1.5;">La distinction fondamentale sur l'espace mémoire est correcte. Cependant, la définition pourrait mentionner le contexte d'exécution ou les ressources systèmes allouées.</p>
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-size:0.9rem;font-weight:700;color:var(--text-1);">Note proposée :</span>
              <span style="font-size:1.1rem;font-weight:900;color:var(--brand-1);">2 / 3</span>
            </div>
          </div>
          
          <div style="display:flex;align-items:center;gap:16px;border-top:1px solid var(--border);padding-top:16px;">
            <div style="flex:1;">
              <label class="form-label" style="font-size:0.85rem;">Note finale (modifiable)</label>
              <input type="number" class="form-input" value="2" style="width:100px;font-size:1.1rem;font-weight:800;" max="3" min="0" step="0.5" />
            </div>
            <div style="flex:3;">
              <label class="form-label" style="font-size:0.85rem;">Commentaire du professeur (Optionnel)</label>
              <input type="text" class="form-input" placeholder="Ajouter une remarque..." value="Bonne compréhension générale, mais l'argumentation doit être approfondie." />
            </div>
          </div>
        </div>
        
      </div>
      <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;background:#fff;border-top:1px solid var(--border);">
        <button class="btn btn-ghost" onclick="document.getElementById('correctionModal').classList.remove('show')">Ignorer pour l'instant</button>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-outline" onclick="alert('L\'IA va re-analyser la copie.')"><i class="fas fa-redo"></i> Nouvelle analyse</button>
          <button class="btn btn-primary" onclick="alert('Copie de Jean A. validée !'); document.getElementById('correctionModal').classList.remove('show'); document.getElementById('publishModal').classList.add('show');"><i class="fas fa-check"></i> Valider et Passer au Suivant</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL PUBLICATION -->
  <div class="modal-overlay" id="publishModal">
    <div class="modal-content" style="max-width:500px;">
      <div class="modal-header">
        <h3 class="modal-title">Publier les résultats</h3>
        <button class="modal-close" onclick="document.getElementById('publishModal').classList.remove('show')"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body" style="padding-right:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:64px;height:64px;background:rgba(16,185,129,0.1);color:var(--success);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 16px;">
            <i class="fas fa-flag-checkered"></i>
          </div>
          <h4 style="font-size:1.2rem;font-weight:900;color:var(--text-1);margin:0 0 8px;">Prêt pour publication</h4>
          <p style="font-size:0.95rem;color:var(--text-2);margin:0;">65 copies reçues • 65 corrigées • 65 validées</p>
        </div>
        
        <p style="font-size:0.95rem;color:var(--text-1);margin:0 0 16px;font-weight:700;">Que souhaitez-vous rendre visible aux étudiants ?</p>
        
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px;background:var(--bg-2);padding:16px;border-radius:var(--r-lg);border:1px solid var(--border);">
          <label class="check-label" style="display:flex;align-items:center;gap:12px;cursor:pointer;">
            <input type="checkbox" checked disabled style="width:18px;height:18px;accent-color:var(--brand-1);">
            <span style="font-size:0.9rem;color:var(--text-1);font-weight:600;">Publier la note finale (Obligatoire)</span>
          </label>
          <label class="check-label" style="display:flex;align-items:center;gap:12px;cursor:pointer;">
            <input type="checkbox" checked style="width:18px;height:18px;accent-color:var(--brand-1);">
            <span style="font-size:0.9rem;color:var(--text-1);font-weight:600;">Publier les commentaires du professeur</span>
          </label>
          <label class="check-label" style="display:flex;align-items:center;gap:12px;cursor:pointer;">
            <input type="checkbox" checked style="width:18px;height:18px;accent-color:var(--brand-1);">
            <span style="font-size:0.9rem;color:var(--text-1);font-weight:600;">Publier la correction détaillée / corrigé type</span>
          </label>
          <label class="check-label" style="display:flex;align-items:center;gap:12px;cursor:pointer;">
            <input type="checkbox" checked style="width:18px;height:18px;accent-color:var(--brand-1);">
            <span style="font-size:0.9rem;color:var(--text-1);font-weight:600;">Autoriser le téléchargement de la copie PDF</span>
          </label>
        </div>
        
        <p style="font-size:0.85rem;color:var(--text-3);margin:0;line-height:1.5;">Les étudiants concernés recevront une notification et pourront consulter leur note et leur correction depuis leur tableau de bord.</p>
      </div>
      <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;">
        <button class="btn btn-ghost" onclick="document.getElementById('publishModal').classList.remove('show')">Annuler</button>
        <button class="btn btn-primary" onclick="alert('Résultats publiés ! Les étudiants ont été notifiés.');document.getElementById('publishModal').classList.remove('show')"><i class="fas fa-paper-plane" style="margin-right:8px;"></i> Publier les résultats</button>
      </div>
    </div>
  </div>

  <!-- MODAL RESULTAT ETUDIANT -->
  <div class="modal-overlay" id="studentResultModal">
    <div class="modal-content" style="max-width:700px;">
      <div class="modal-header">
        <h3 class="modal-title">Résultats : Réseaux Informatiques</h3>
        <button class="modal-close" onclick="document.getElementById('studentResultModal').classList.remove('show')"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body" style="padding-right:12px;max-height:70vh;overflow-y:auto;">
        
        <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-xl);padding:32px;text-align:center;margin-bottom:24px;">
          <div style="font-size:0.9rem;color:var(--text-3);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Note Finale</div>
          <div style="font-size:3rem;font-weight:900;color:var(--brand-1);line-height:1;">14.5<span style="font-size:1.5rem;color:var(--text-3);">/20</span></div>
          <div style="font-size:1rem;color:var(--success);font-weight:800;margin-top:12px;">Score : 72.5 %</div>
        </div>
        
        <div style="background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;">
          <h4 style="font-size:1.05rem;font-weight:800;color:var(--text-1);margin:0 0 16px;"><i class="fas fa-comment-dots" style="color:var(--brand-1);margin-right:8px;"></i>Appréciation globale du professeur</h4>
          <p style="font-size:0.95rem;color:var(--text-2);margin:0;line-height:1.6;font-style:italic;">
            "Bon ensemble. Les concepts de base du modèle OSI sont bien maîtrisés. Attention à la précision sur le routage dynamique (BGP)."
          </p>
        </div>

        <div style="display:flex;justify-content:center;gap:16px;">
          <button class="btn btn-outline"><i class="fas fa-list-check"></i> Voir le détail des questions</button>
          <button class="btn btn-primary"><i class="fas fa-download"></i> Télécharger ma copie (PDF)</button>
        </div>
      </div>
    </div>
  </div>
"""

content = content.replace("</body>", modals + "\n</body>")

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)
