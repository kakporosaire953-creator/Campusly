import re

with open('dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Sidebar Links
sidebar_replacements = [
    ('href="dashboard.html" class="side-link active"', 'href="#overview" class="side-link active" data-view="overview"'),
    ('href="revision.html" class="side-link"', 'href="#revision" class="side-link" data-view="revision"'),
    ('href="classrooms.html" class="side-link"', 'href="#classrooms" class="side-link" data-view="classrooms"'),
    ('href="composition.html" class="side-link"', 'href="#composition" class="side-link" data-view="composition"'),
    ('href="epreuves.html" class="side-link"', 'href="#epreuves" class="side-link" data-view="epreuves"'),
    ('href="forum.html" class="side-link"', 'href="#forum" class="side-link" data-view="forum"')
]

for old, new in sidebar_replacements:
    content = content.replace(old, new)

# If forum link doesn't exist, we add it
if 'data-view="forum"' not in content:
    epreuves_block = """      <li>
        <a href="#epreuves" class="side-link" data-view="epreuves">
          <i class="fa-solid fa-folder-open"></i>
          <span>Épreuves & Annales</span>
        </a>
      </li>"""
    forum_block = """      <li>
        <a href="#forum" class="side-link" data-view="forum">
          <i class="fa-solid fa-comments"></i>
          <span>Forum & Entraide</span>
        </a>
      </li>"""
    content = content.replace(epreuves_block, epreuves_block + "\n" + forum_block)

# 2. Wrap app-body contents in #view-overview
body_start = content.find('<div class="app-body">')
body_end = content.find('  </main>')

if body_start != -1 and body_end != -1:
    before_body = content[:body_start + len('<div class="app-body">\n')]
    
    # We need to find the end of app-body, which is right before </main>
    # There are two closing divs before </main>
    # So we'll slice correctly
    app_body_content_end = content.rfind('</div>', body_start, body_end)
    app_body_content_end = content.rfind('</div>', body_start, app_body_content_end)
    
    # Actually, simpler: everything inside app-body needs to be wrapped. 
    # Let's just use regex to extract the contents of app-body
    pattern = re.compile(r'<div class="app-body">(.*?)</div>\s*</main>', re.DOTALL)
    match = pattern.search(content)
    
    if match:
        body_content = match.group(1)
        before_body = content[:match.start()] + '<div class="app-body">\n'
        after_body = '</div>\n  </main>' + content[match.end():]
        
        # Wrap in view-overview
        new_body_content = '      <div id="view-overview" class="dash-view active">\n' + body_content + '\n      </div>\n'
        
        # Add other views
        new_body_content += """
      <!-- VUE CLASSROOMS -->
      <div id="view-classrooms" class="dash-view" style="display:none;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
          <div>
            <h2 style="font-size:1.5rem;font-weight:900;color:var(--text-1);margin:0 0 4px;">Classrooms Amphi</h2>
            <p style="font-size:0.9rem;color:var(--text-2);margin:0;">Groupes de cours et suivi pédagogique pour l'UAC.</p>
          </div>
          <div style="display:flex;gap:10px;" id="teacherClassroomActions">
            <button class="btn btn-primary" onclick="alert('Module de création de classe (Fonctionnalité Professeur)')">
              <i class="fas fa-plus"></i> Créer une classe
            </button>
          </div>
          <div style="display:flex;gap:10px;" id="learnerClassroomActions" style="display:none;">
            <button class="btn btn-primary" onclick="alert('Rejoindre une classe (Code Invitation)')">
              <i class="fas fa-sign-in-alt"></i> Rejoindre un Amphi
            </button>
          </div>
        </div>
        
        <div class="dash-metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div class="stat-card" style="padding:20px;border-radius:var(--r-xl);cursor:pointer;" onclick="alert('Ouverture de la classe L2 Informatique')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
              <div style="width:40px;height:40px;border-radius:10px;background:rgba(21,101,192,0.1);color:var(--brand-1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">
                <i class="fas fa-code"></i>
              </div>
              <span class="role-badge learner" style="font-size:0.7rem;">EN COURS</span>
            </div>
            <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-1);margin:0 0 4px;">L2 Informatique - Algorithmique</h3>
            <p style="font-size:0.8rem;color:var(--text-3);margin:0 0 16px;">Dr. K. AGBOTON • FAST</p>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:12px;">
              <span style="font-size:0.8rem;color:var(--text-2);font-weight:600;"><i class="fas fa-users" style="margin-right:4px;"></i> 68 étudiants</span>
              <button class="btn btn-outline btn-sm">Accéder</button>
            </div>
          </div>
          
          <div class="stat-card" style="padding:20px;border-radius:var(--r-xl);cursor:pointer;" onclick="alert('Ouverture de la classe L2 Mathématiques')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
              <div style="width:40px;height:40px;border-radius:10px;background:rgba(245,124,0,0.1);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">
                <i class="fas fa-square-root-variable"></i>
              </div>
            </div>
            <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-1);margin:0 0 4px;">L2 Mathématiques - Analyse</h3>
            <p style="font-size:0.8rem;color:var(--text-3);margin:0 0 16px;">Prof. R. MENSAH • FAST</p>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:12px;">
              <span style="font-size:0.8rem;color:var(--text-2);font-weight:600;"><i class="fas fa-users" style="margin-right:4px;"></i> 112 étudiants</span>
              <button class="btn btn-outline btn-sm">Accéder</button>
            </div>
          </div>
        </div>
      </div>

      <!-- VUE EPREUVES (NOUVELLE) -->
      <div id="view-epreuves" class="dash-view" style="display:none;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
          <div>
            <h2 style="font-size:1.5rem;font-weight:900;color:var(--text-1);margin:0 0 4px;">Bibliothèque d'Épreuves</h2>
            <p style="font-size:0.9rem;color:var(--text-2);margin:0;">Annales de l'UAC, TD et corrections intelligentes.</p>
          </div>
          <div style="display:flex;gap:10px;">
            <input type="text" placeholder="Rechercher une matière..." class="form-input" style="width:250px;padding:8px 12px;font-size:0.85rem;" />
            <select class="form-select" style="padding:8px 12px;font-size:0.85rem;">
              <option>Filtre: Toutes les Facultés</option>
              <option>FAST</option>
              <option>FADESP</option>
              <option>FASEG</option>
            </select>
            <button class="btn btn-accent"><i class="fas fa-upload"></i> Contribuer</button>
          </div>
        </div>
        
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-xl);padding:40px;text-align:center;">
          <div style="font-size:3rem;color:var(--brand-1);margin-bottom:16px;"><i class="fas fa-folder-open"></i></div>
          <h3 style="font-size:1.2rem;font-weight:800;color:var(--text-1);margin-bottom:8px;">Base de données en cours de synchronisation</h3>
          <p style="color:var(--text-2);max-width:400px;margin:0 auto 20px;font-size:0.9rem;">
            Nous sommes en train de migrer les épreuves vers le nouveau format Campusly 2.0. La correction par l'IA sera bientôt disponible sur toutes les anciennes annales !
          </p>
          <button class="btn btn-primary" onclick="alert('Chargement des épreuves locales...')">Actualiser la liste</button>
        </div>
      </div>

      <!-- VUE FORUM (NOUVELLE) -->
      <div id="view-forum" class="dash-view" style="display:none;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
          <div>
            <h2 style="font-size:1.5rem;font-weight:900;color:var(--text-1);margin:0 0 4px;">Forum & Entraide</h2>
            <p style="font-size:0.9rem;color:var(--text-2);margin:0;">Posez vos questions et échangez avec vos pairs ou avec Campusly AI.</p>
          </div>
          <button class="btn btn-primary"><i class="fas fa-pen"></i> Nouvelle discussion</button>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 300px;gap:24px;">
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;">
              <div style="display:flex;gap:16px;">
                <div style="width:48px;height:48px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">AB</div>
                <div>
                  <h4 style="font-size:1rem;font-weight:700;color:var(--text-1);margin:0 0 4px;">Besoin d'aide sur le théorème de Bolzano-Weierstrass (Analyse L2)</h4>
                  <p style="font-size:0.85rem;color:var(--text-2);margin:0 0 12px;line-height:1.5;">Je bloque sur l'application du théorème dans le cas d'une suite définie par récurrence. Quelqu'un aurait un exemple corrigé ?</p>
                  <div style="display:flex;gap:12px;align-items:center;font-size:0.8rem;color:var(--text-3);font-weight:600;">
                    <span style="color:var(--brand-1);"><i class="fas fa-arrow-up"></i> 14</span>
                    <span><i class="fas fa-comment"></i> 3 réponses</span>
                    <span style="background:var(--bg-2);padding:2px 8px;border-radius:4px;border:1px solid var(--border);">FAST</span>
                    <span style="background:var(--bg-2);padding:2px 8px;border-radius:4px;border:1px solid var(--border);">Mathématiques</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;">
              <div style="display:flex;gap:16px;">
                <div style="width:48px;height:48px;border-radius:50%;background:rgba(21,101,192,0.1);color:var(--brand-1);display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;"><i class="fas fa-robot"></i></div>
                <div>
                  <h4 style="font-size:1rem;font-weight:700;color:var(--text-1);margin:0 0 4px;">[Campusly AI] - Résumé de la semaine : Complexité Algorithmique</h4>
                  <p style="font-size:0.85rem;color:var(--text-2);margin:0 0 12px;line-height:1.5;">Voici un condensé des points clés vus en cours Magistral pour le chapitre 3. N'hésitez pas à poser vos questions en commentaire.</p>
                  <div style="display:flex;gap:12px;align-items:center;font-size:0.8rem;color:var(--text-3);font-weight:600;">
                    <span style="color:var(--brand-1);"><i class="fas fa-arrow-up"></i> 42</span>
                    <span><i class="fas fa-comment"></i> 8 réponses</span>
                    <span style="background:var(--bg-2);padding:2px 8px;border-radius:4px;border:1px solid var(--border);">Campusly AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;">
              <h4 style="font-size:0.9rem;font-weight:800;color:var(--text-1);margin:0 0 12px;">Sujets Populaires</h4>
              <ul style="list-style:none;padding:0;margin:0;font-size:0.85rem;color:var(--text-2);display:flex;flex-direction:column;gap:10px;">
                <li><a href="#" style="color:var(--brand-1);text-decoration:none;font-weight:600;">#AnalyseReelle</a> (24)</li>
                <li><a href="#" style="color:var(--brand-1);text-decoration:none;font-weight:600;">#Algorithmique</a> (18)</li>
                <li><a href="#" style="color:var(--brand-1);text-decoration:none;font-weight:600;">#BiologieCellulaire</a> (12)</li>
                <li><a href="#" style="color:var(--brand-1);text-decoration:none;font-weight:600;">#DroitConstitutionnel</a> (9)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
"""
        
        # 3. Add JS Router Logic
        script_injection = """
  window.navigateToView = function(viewId) {
    // 1. Hide all views
    document.querySelectorAll('.dash-view').forEach(el => el.style.display = 'none');
    
    // 2. Show target view
    const target = document.getElementById('view-' + viewId);
    if (target) {
      target.style.display = 'block';
      // Trigger animation
      target.style.opacity = '0';
      target.style.transform = 'translateY(10px)';
      setTimeout(() => {
        target.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
      }, 10);
    }
    
    // 3. Update sidebar active state
    document.querySelectorAll('.side-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.side-link[data-view="${viewId}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    // 4. Update breadcrumb
    const breadcrumbLabel = activeLink ? activeLink.querySelector('span').textContent : 'Tableau de bord';
    const dashTitle = document.querySelector('[data-i18n="dash_title"]');
    if (dashTitle) dashTitle.textContent = breadcrumbLabel;
    
    // 5. Close sidebar on mobile
    if (window.innerWidth <= 1024) {
      const sb = document.getElementById('appSidebar');
      if (sb) sb.classList.remove('show');
    }
  };

  // Add click listeners to sidebar links
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.side-link[data-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = link.getAttribute('data-view');
        // Handle external pages that haven't been ported yet
        if (viewId === 'revision' || viewId === 'composition') {
          window.location.href = viewId + '.html';
          return;
        }
        window.navigateToView(viewId);
      });
    });
    
    // Handle initial hash
    if (window.location.hash) {
      const initialView = window.location.hash.replace('#', '');
      if (['overview', 'classrooms', 'epreuves', 'forum'].includes(initialView)) {
        window.navigateToView(initialView);
      }
    }
  });
"""
        after_body = after_body.replace('  function renderDashboard() {', script_injection + '\n  function renderDashboard() {')

        # also update teacher/learner UI logic for classrooms
        teacher_logic = "    document.getElementById('teacherClassroomActions').style.display = isTeacher ? 'flex' : 'none';\n    document.getElementById('learnerClassroomActions').style.display = isTeacher ? 'none' : 'flex';"
        after_body = after_body.replace("    document.getElementById('teacherView').style.display = isTeacher ? 'block' : 'none';", "    document.getElementById('teacherView').style.display = isTeacher ? 'block' : 'none';\n" + teacher_logic)


        new_content = before_body + new_body_content + after_body
        
        with open('dashboard.html', 'w', encoding='utf-8') as fw:
            fw.write(new_content)
        print("Dashboard updated successfully.")
    else:
        print("Could not match app-body with regex.")

