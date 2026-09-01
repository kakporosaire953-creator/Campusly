import re

with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

modal_html = """
  <!-- MODAL CREATION COMPOSITION -->
  <div class="modal-overlay" id="createCompModal">
    <div class="modal-content" style="max-width:700px;">
      <div class="modal-header">
        <h3 class="modal-title">Créer une composition</h3>
        <button class="modal-close" onclick="document.getElementById('createCompModal').classList.remove('show')"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body" style="max-height:60vh;overflow-y:auto;padding-right:12px;">
        
        <div style="margin-bottom:24px;">
          <label class="form-label">Titre de l'épreuve</label>
          <input type="text" class="form-input" placeholder="Ex: Algorithmique Avancée & Graphes" />
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div>
            <label class="form-label">Matière</label>
            <select class="form-select">
              <option>Informatique</option>
              <option>Mathématiques</option>
              <option>Physique</option>
            </select>
          </div>
          <div>
            <label class="form-label">Classe / Niveau</label>
            <select class="form-select">
              <option>L2 Informatique</option>
              <option>L1 Mathématiques</option>
            </select>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div>
            <label class="form-label">Date (Optionnel)</label>
            <input type="date" class="form-input" />
          </div>
          <div>
            <label class="form-label">Durée (minutes)</label>
            <input type="number" class="form-input" placeholder="60" value="60" />
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <label class="form-label">Consignes du professeur</label>
          <textarea class="form-input" style="height:100px;resize:vertical;" placeholder="Lisez attentivement... Une seule tentative..."></textarea>
        </div>

        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;margin-bottom:24px;">
          <h4 style="font-size:0.95rem;font-weight:800;color:var(--text-1);margin:0 0 12px;">Sécurité & Surveillance</h4>
          
          <label class="check-label" style="display:flex;align-items:center;gap:12px;margin-bottom:12px;cursor:pointer;">
            <input type="checkbox" checked style="width:18px;height:18px;accent-color:var(--brand-1);">
            <span style="font-size:0.9rem;color:var(--text-2);font-weight:600;">Chronomètre strict</span>
          </label>
          
          <label class="check-label" style="display:flex;align-items:center;gap:12px;margin-bottom:12px;cursor:pointer;">
            <input type="checkbox" checked style="width:18px;height:18px;accent-color:var(--brand-1);">
            <span style="font-size:0.9rem;color:var(--text-2);font-weight:600;">Détection de sortie de fenêtre (Simulation)</span>
          </label>
          
          <label class="check-label" style="display:flex;align-items:center;gap:12px;margin-bottom:0;cursor:pointer;">
            <input type="checkbox" style="width:18px;height:18px;accent-color:var(--brand-1);">
            <span style="font-size:0.9rem;color:var(--text-2);font-weight:600;">Surveillance caméra (Simulation)</span>
          </label>
        </div>
        
        <div style="background:rgba(21,101,192,0.05);border:1px dashed var(--brand-1);border-radius:var(--r-lg);padding:32px;text-align:center;cursor:pointer;">
          <i class="fas fa-file-upload" style="font-size:2rem;color:var(--brand-1);margin-bottom:12px;"></i>
          <h4 style="font-size:1rem;font-weight:800;color:var(--text-1);margin:0 0 8px;">Importer une épreuve (PDF/Doc)</h4>
          <p style="font-size:0.85rem;color:var(--text-2);margin:0;">L'IA de Campusly extraira automatiquement les questions. (Simulation)</p>
        </div>

      </div>
      <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;">
        <button class="btn btn-ghost" onclick="document.getElementById('createCompModal').classList.remove('show')">Annuler</button>
        <button class="btn btn-primary" onclick="alert('Composition créée ! Code d\\'accès : CMP-NEW26');document.getElementById('createCompModal').classList.remove('show')">Générer le code</button>
      </div>
    </div>
  </div>
"""

# Inject before </body>
content = content.replace("</body>", modal_html + "\n</body>")

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

