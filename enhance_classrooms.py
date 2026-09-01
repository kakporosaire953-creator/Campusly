import re

with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_classrooms_html = """
      <!-- VUE CLASSROOMS -->
      <div id="view-classrooms" class="dash-view" style="display:none;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
          <div>
            <h2 style="font-size:1.6rem;font-weight:900;color:var(--text-1);margin:0 0 6px;">Classrooms Amphi</h2>
            <p style="font-size:0.95rem;color:var(--text-2);margin:0;">Vos groupes de cours, suivis et évaluations centralisés.</p>
          </div>
          <div style="display:flex;gap:12px;" id="teacherClassroomActions">
            <button class="btn btn-primary" style="box-shadow: 0 4px 12px rgba(21,101,192,0.3);" onclick="alert('Module de création de classe ouvert')">
              <i class="fas fa-plus"></i> Créer un Amphi
            </button>
          </div>
          <div style="display:flex;gap:12px;" id="learnerClassroomActions" style="display:none;">
            <button class="btn btn-primary" style="box-shadow: 0 4px 12px rgba(21,101,192,0.3);" onclick="alert('Rejoindre une classe')">
              <i class="fas fa-sign-in-alt"></i> Rejoindre un Amphi
            </button>
          </div>
        </div>
        
        <div class="dash-metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          
          <!-- Carte Classe 1 -->
          <div class="stat-card" style="padding:24px;border-radius:var(--r-2xl);cursor:pointer;background:#fff;border:1px solid var(--border);box-shadow:var(--shadow-sm);transition:all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='var(--shadow-sm)';" onclick="alert('Ouverture de la classe L2 Informatique')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
              <div style="width:48px;height:48px;border-radius:12px;background:rgba(21,101,192,0.1);color:var(--brand-1);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
                <i class="fas fa-code"></i>
              </div>
              <span class="role-badge learner" style="font-size:0.75rem;padding:4px 10px;background:rgba(16,185,129,0.1);color:var(--success);border-color:var(--success);">EN COURS</span>
            </div>
            <h3 style="font-size:1.2rem;font-weight:800;color:var(--text-1);margin:0 0 6px;">Algorithmique & Graphes</h3>
            <p style="font-size:0.85rem;color:var(--text-3);margin:0 0 16px;font-weight:600;">L2 Informatique • FAST</p>
            
            <div style="background:var(--bg-2);border-radius:var(--r-lg);padding:12px;margin-bottom:20px;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                <div style="width:28px;height:28px;border-radius:50%;background:var(--grad-brand);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;">KA</div>
                <span style="font-size:0.85rem;font-weight:700;color:var(--text-1);">Dr. K. AGBOTON</span>
              </div>
              <p style="font-size:0.75rem;color:var(--text-2);margin:0;"><i class="fas fa-bullhorn" style="color:var(--warning);margin-right:4px;"></i> "N'oubliez pas le TP de vendredi sur les arbres AVL."</p>
            </div>
            
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:16px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <div style="display:flex;align-items:center;">
                  <div style="width:24px;height:24px;border-radius:50%;background:#e2e8f0;border:2px solid #fff;z-index:3;"></div>
                  <div style="width:24px;height:24px;border-radius:50%;background:#cbd5e1;border:2px solid #fff;margin-left:-8px;z-index:2;"></div>
                  <div style="width:24px;height:24px;border-radius:50%;background:#94a3b8;border:2px solid #fff;margin-left:-8px;z-index:1;"></div>
                </div>
                <span style="font-size:0.8rem;color:var(--text-2);font-weight:600;">+65 autres</span>
              </div>
              <button class="btn btn-outline btn-sm" style="border-radius:var(--r-full);padding:6px 16px;">Accéder <i class="fas fa-arrow-right" style="margin-left:4px;"></i></button>
            </div>
          </div>
          
          <!-- Carte Classe 2 -->
          <div class="stat-card" style="padding:24px;border-radius:var(--r-2xl);cursor:pointer;background:#fff;border:1px solid var(--border);box-shadow:var(--shadow-sm);transition:all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='var(--shadow-sm)';" onclick="alert('Ouverture de la classe L2 Mathématiques')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
              <div style="width:48px;height:48px;border-radius:12px;background:rgba(245,124,0,0.1);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
                <i class="fas fa-square-root-variable"></i>
              </div>
            </div>
            <h3 style="font-size:1.2rem;font-weight:800;color:var(--text-1);margin:0 0 6px;">Analyse Réelle & Complexe</h3>
            <p style="font-size:0.85rem;color:var(--text-3);margin:0 0 16px;font-weight:600;">L2 Mathématiques • FAST</p>
            
            <div style="background:var(--bg-2);border-radius:var(--r-lg);padding:12px;margin-bottom:20px;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                <div style="width:28px;height:28px;border-radius:50%;background:var(--grad-accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;">RM</div>
                <span style="font-size:0.85rem;font-weight:700;color:var(--text-1);">Prof. R. MENSAH</span>
              </div>
              <p style="font-size:0.75rem;color:var(--text-2);margin:0;"><i class="fas fa-file-pdf" style="color:var(--danger);margin-right:4px;"></i> Le polycopié du Chapitre 4 est disponible.</p>
            </div>
            
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:16px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <div style="display:flex;align-items:center;">
                  <div style="width:24px;height:24px;border-radius:50%;background:#e2e8f0;border:2px solid #fff;z-index:3;"></div>
                  <div style="width:24px;height:24px;border-radius:50%;background:#cbd5e1;border:2px solid #fff;margin-left:-8px;z-index:2;"></div>
                </div>
                <span style="font-size:0.8rem;color:var(--text-2);font-weight:600;">112 inscrits</span>
              </div>
              <button class="btn btn-outline btn-sm" style="border-radius:var(--r-full);padding:6px 16px;">Accéder <i class="fas fa-arrow-right" style="margin-left:4px;"></i></button>
            </div>
          </div>
          
        </div>
      </div>
"""

# Replace old view-classrooms with new
pattern = re.compile(r'<!-- VUE CLASSROOMS -->.*?<!-- VUE EPREUVES \(NOUVELLE\) -->', re.DOTALL)
content = pattern.sub(new_classrooms_html + '\n      <!-- VUE EPREUVES (NOUVELLE) -->', content)

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

