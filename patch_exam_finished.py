with open('exam-room.html', 'r', encoding='utf-8') as f:
    content = f.read()

view_finished_start = content.find('<div id="viewFinished" class="exam-view">')
view_finished_end = content.find('  <!-- Overlays & Modals -->', view_finished_start)

new_view_finished = """<div id="viewFinished" class="exam-view">
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;">
      <div style="width:80px;height:80px;background:rgba(16,185,129,0.1);color:var(--success);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:3rem;margin-bottom:24px;">
        <i class="fas fa-check"></i>
      </div>
      <h2 style="font-size:2.5rem;font-weight:900;color:var(--text-1);margin:0 0 16px;">Composition Terminée</h2>
      <p style="font-size:1.1rem;color:var(--text-2);max-width:500px;line-height:1.6;margin:0 0 16px;">
        Votre copie a bien été enregistrée.
      </p>
      <p style="font-size:1.1rem;color:var(--text-2);max-width:500px;line-height:1.6;margin:0 0 32px;">
        Votre professeur doit maintenant corriger et valider les résultats avant leur publication.
      </p>
      
      <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xl);padding:24px;display:flex;flex-direction:column;gap:16px;margin-bottom:40px;width:100%;max-width:400px;text-align:left;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:12px;">
          <span style="font-size:0.9rem;color:var(--text-3);font-weight:600;">Statut</span>
          <span style="font-size:0.9rem;font-weight:800;background:rgba(21,101,192,0.1);color:var(--brand-1);padding:4px 10px;border-radius:var(--r-full);">Copie soumise</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:12px;">
          <span style="font-size:0.9rem;color:var(--text-3);font-weight:600;">Date et Heure</span>
          <span style="font-size:0.9rem;font-weight:700;color:var(--text-1);" id="submitTime">--:--</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:12px;">
          <span style="font-size:0.9rem;color:var(--text-3);font-weight:600;">Composition</span>
          <span style="font-size:0.9rem;font-weight:700;color:var(--text-1);" id="submitCompName">Algorithmique Avancée</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.9rem;color:var(--text-3);font-weight:600;">Professeur</span>
          <span style="font-size:0.9rem;font-weight:700;color:var(--text-1);" id="submitProfName">Dr. K. AGBOTON</span>
        </div>
      </div>
      
      <button class="btn btn-primary" onclick="window.location.href='dashboard.html#composition'">Retour à mes Compositions</button>
    </div>
  </div>
"""

content = content[:view_finished_start] + new_view_finished + content[view_finished_end:]

# Update submitExam JS to not update submitScore since it's removed, and update the time properly.
submit_exam_start = content.find("window.submitExam = function() {")
submit_exam_end = content.find("};", submit_exam_start) + 2

new_submit_exam = """window.submitExam = function() {
      document.getElementById('finishModal').classList.remove('show');
      clearInterval(timerInterval);
      
      // Exit fullscreen safely
      try {
        if (document.exitFullscreen) document.exitFullscreen().catch(e=>{});
      } catch(e){}
      
      document.querySelectorAll('.exam-view').forEach(v => v.classList.remove('active'));
      document.getElementById('viewFinished').classList.add('active');
      
      const now = new Date();
      document.getElementById('submitTime').textContent = now.toLocaleDateString('fr-FR') + ' à ' + now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
      if (mockComposition) {
         document.getElementById('submitCompName').textContent = mockComposition.title;
         document.getElementById('submitProfName').textContent = mockComposition.professor;
      }
    };"""

content = content[:submit_exam_start] + new_submit_exam + content[submit_exam_end:]

with open('exam-room.html', 'w', encoding='utf-8') as f:
    f.write(content)

