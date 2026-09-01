exam_html = """<!DOCTYPE html>
<html lang="fr" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salle de Composition — Campusly</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/modern.css" />
  <link rel="stylesheet" href="css/theme-light.css" />

  <style>
    body {
      margin: 0;
      padding: 0;
      background: var(--bg-2);
      color: var(--text-1);
      font-family: var(--font-sans);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    /* Utility for views */
    .exam-view { display: none; flex: 1; }
    .exam-view.active { display: flex; flex-direction: column; }

    /* ========== STATE 1: WAITING ROOM ========== */
    .waiting-header {
      padding: 20px 40px;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .waiting-container {
      display: flex;
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      gap: 40px;
      width: 100%;
      box-sizing: border-box;
    }
    @media (max-width: 900px) {
      .waiting-container { flex-direction: column; }
    }
    
    /* Left Panel - Info */
    .info-panel {
      flex: 1;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--r-2xl);
      padding: 32px;
      height: fit-content;
    }
    
    /* Right Panel - Onboarding Steps */
    .onboarding-panel {
      flex: 1.5;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .step-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--r-xl);
      padding: 24px;
      opacity: 0.5;
      pointer-events: none;
      transition: all 0.3s;
      transform: translateY(10px);
    }
    .step-card.active {
      opacity: 1;
      pointer-events: auto;
      border-color: var(--brand-2);
      box-shadow: 0 4px 20px rgba(21,101,192,0.08);
      transform: translateY(0);
    }
    .step-card.completed {
      opacity: 0.8;
      border-color: var(--success);
    }
    .step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .step-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-1);
      margin: 0;
    }
    .step-badge {
      font-size: 0.75rem;
      font-weight: 800;
      background: var(--surface);
      padding: 4px 10px;
      border-radius: var(--r-full);
      color: var(--text-2);
    }
    
    /* Security List */
    .sec-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--surface);
      border-radius: var(--r-md);
      margin-bottom: 8px;
    }
    .sec-item.simulated {
      border: 1px dashed var(--border-2);
    }
    .sim-tag {
      font-size: 0.65rem;
      font-weight: 800;
      background: rgba(245,124,0,0.1);
      color: var(--warning);
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: auto;
    }
    
    /* Checklist */
    .check-label {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      cursor: pointer;
    }
    .check-label input {
      margin-top: 4px;
      width: 18px;
      height: 18px;
      accent-color: var(--brand-1);
    }
    .check-text {
      font-size: 0.9rem;
      color: var(--text-2);
      font-weight: 500;
    }

    /* ========== STATE 2: ACTIVE EXAM ========== */
    .exam-header {
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
    .timer-box {
      font-family: var(--font-mono);
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-1);
      background: var(--surface);
      padding: 6px 16px;
      border-radius: var(--r-md);
      border: 1px solid var(--border);
      letter-spacing: 2px;
    }
    .timer-box.urgent {
      color: var(--danger);
      border-color: rgba(239,68,68,0.3);
      background: rgba(239,68,68,0.05);
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }
    
    .exam-body {
      display: flex;
      flex: 1;
      height: calc(100vh - 76px);
    }
    
    /* Left Sidebar - Nav */
    .exam-sidebar {
      width: 280px;
      background: var(--bg);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
    }
    .q-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      padding: 20px;
      overflow-y: auto;
    }
    .q-btn {
      aspect-ratio: 1;
      border-radius: var(--r-md);
      border: 1px solid var(--border-2);
      background: var(--bg-2);
      color: var(--text-2);
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .q-btn.active {
      border-color: var(--brand-1);
      background: var(--surface);
      color: var(--brand-1);
    }
    .q-btn.answered {
      background: rgba(16,185,129,0.1);
      border-color: rgba(16,185,129,0.3);
      color: var(--success);
    }
    .q-btn.marked {
      border-color: var(--warning);
      color: var(--warning);
    }
    .q-btn.marked::after {
      content: '';
      position: absolute;
      top: -4px;
      right: -4px;
      width: 12px;
      height: 12px;
      background: var(--warning);
      border-radius: 50%;
      border: 2px solid var(--bg);
    }
    
    /* Main Question Area */
    .exam-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg-2);
      position: relative;
    }
    .q-content {
      flex: 1;
      padding: 40px 60px;
      overflow-y: auto;
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .q-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-1);
      margin-bottom: 24px;
      line-height: 1.5;
    }
    
    .option-btn {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 16px 20px;
      background: var(--bg);
      border: 1px solid var(--border-2);
      border-radius: var(--r-lg);
      margin-bottom: 12px;
      cursor: pointer;
      text-align: left;
      font-size: 1rem;
      color: var(--text-2);
      font-weight: 500;
      transition: all 0.2s;
    }
    .option-btn:hover {
      background: var(--surface);
      border-color: var(--border);
    }
    .option-btn.selected {
      background: rgba(21,101,192,0.06);
      border-color: var(--brand-1);
      color: var(--brand-1);
      font-weight: 700;
    }
    .opt-letter {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--bg-2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      font-weight: 800;
      color: var(--text-3);
    }
    .option-btn.selected .opt-letter {
      background: var(--brand-1);
      color: #fff;
    }
    
    .exam-footer {
      background: var(--bg);
      border-top: 1px solid var(--border);
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* ========== STATE 3: MODAL & SCREENS ========== */
    .countdown-overlay {
      position: fixed;
      top:0; left:0; right:0; bottom:0;
      background: var(--bg);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    .countdown-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }
    .cd-number {
      font-size: 6rem;
      font-weight: 900;
      color: var(--brand-1);
      font-family: var(--font-mono);
    }
    
    .finish-modal {
      position: fixed;
      top:0; left:0; right:0; bottom:0;
      background: rgba(15,23,42,0.8);
      backdrop-filter: blur(8px);
      z-index: 9000;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .finish-modal.show { display: flex; }
    .modal-content {
      background: var(--bg);
      padding: 32px;
      border-radius: var(--r-2xl);
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

  </style>
</head>
<body>

  <!-- ==================== VIEW: WAITING ROOM ==================== -->
  <div id="viewWaiting" class="exam-view active">
    <header class="waiting-header">
      <div class="logo-text">
        <span class="logo-campus">Campus</span><span class="logo-ly">ly</span>
        <span style="font-size:0.65rem;font-weight:900;background:var(--bg-2);color:var(--text-3);padding:2px 6px;border-radius:var(--r-full);border:1px solid var(--border);margin-left:6px;">EXAMEN</span>
      </div>
      <div id="studentNameBadge" style="font-size:0.85rem;font-weight:700;color:var(--text-2);background:var(--bg-2);padding:6px 16px;border-radius:var(--r-full);">
        Chargement...
      </div>
    </header>
    
    <div class="waiting-container">
      
      <!-- Left: Info -->
      <div class="info-panel">
        <div style="width:64px;height:64px;background:rgba(21,101,192,0.1);color:var(--brand-1);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:24px;">
          <i class="fas fa-file-signature"></i>
        </div>
        <h1 id="examTitle" style="font-size:1.8rem;font-weight:900;color:var(--text-1);margin:0 0 8px;">Titre de la composition</h1>
        <p id="examSubject" style="font-size:1rem;color:var(--brand-1);font-weight:700;margin:0 0 24px;">Matière</p>
        
        <div style="display:flex;flex-direction:column;gap:16px;border-top:1px solid var(--border);padding-top:24px;">
          <div style="display:flex;align-items:center;gap:16px;">
            <i class="fas fa-user-tie" style="color:var(--text-3);width:20px;text-align:center;"></i>
            <div>
              <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;text-transform:uppercase;">Professeur</div>
              <div id="examTeacher" style="font-size:0.95rem;font-weight:700;color:var(--text-1);">Nom du professeur</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;">
            <i class="fas fa-stopwatch" style="color:var(--text-3);width:20px;text-align:center;"></i>
            <div>
              <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;text-transform:uppercase;">Durée stricte</div>
              <div id="examDuration" style="font-size:0.95rem;font-weight:700;color:var(--text-1);">-- min</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;">
            <i class="fas fa-list-ol" style="color:var(--text-3);width:20px;text-align:center;"></i>
            <div>
              <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;text-transform:uppercase;">Questions</div>
              <div id="examQCount" style="font-size:0.95rem;font-weight:700;color:var(--text-1);">-- QCM</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;">
            <i class="fas fa-rotate" style="color:var(--text-3);width:20px;text-align:center;"></i>
            <div>
              <div style="font-size:0.75rem;color:var(--text-3);font-weight:600;text-transform:uppercase;">Tentative</div>
              <div style="font-size:0.95rem;font-weight:700;color:var(--text-1);">Unique (1/1)</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right: Steps -->
      <div class="onboarding-panel">
        
        <!-- Step 1 -->
        <div class="step-card active" id="step1">
          <div class="step-header">
            <h3 class="step-title">1. Bienvenue dans la salle d'attente</h3>
            <span class="step-badge">1 / 4</span>
          </div>
          <p style="font-size:0.9rem;color:var(--text-2);line-height:1.6;margin:0 0 16px;">
            Vous êtes sur le point de commencer votre composition officielle. Prenez quelques instants pour vérifier les informations affichées à gauche. Assurez-vous d'avoir une connexion internet stable.
          </p>
          <button class="btn btn-primary btn-sm" onclick="nextStep(1)">Suivant <i class="fas fa-arrow-right"></i></button>
        </div>
        
        <!-- Step 2 -->
        <div class="step-card" id="step2">
          <div class="step-header">
            <h3 class="step-title">2. Consignes du professeur</h3>
            <span class="step-badge">2 / 4</span>
          </div>
          <div style="background:var(--surface);padding:16px;border-radius:var(--r-md);margin-bottom:16px;">
            <ul id="examRulesList" style="margin:0;padding-left:20px;font-size:0.85rem;color:var(--text-1);line-height:1.6;display:flex;flex-direction:column;gap:8px;">
              <li>Lisez attentivement chaque question.</li>
              <li>Une seule tentative est autorisée.</li>
              <li>Toute soumission est définitive.</li>
              <li>Aucun document externe n'est autorisé.</li>
            </ul>
          </div>
          <button class="btn btn-primary btn-sm" onclick="nextStep(2)">J'ai compris <i class="fas fa-check"></i></button>
        </div>
        
        <!-- Step 3 -->
        <div class="step-card" id="step3">
          <div class="step-header">
            <h3 class="step-title">3. Paramètres de Sécurité</h3>
            <span class="step-badge">3 / 4</span>
          </div>
          <div style="margin-bottom:16px;">
            <div class="sec-item">
              <i class="fas fa-clock" style="color:var(--brand-1);"></i>
              <span style="font-size:0.85rem;font-weight:600;color:var(--text-1);">Chronomètre strict actif</span>
            </div>
            <div class="sec-item">
              <i class="fas fa-window-restore" style="color:var(--brand-1);"></i>
              <span style="font-size:0.85rem;font-weight:600;color:var(--text-1);">Plein écran requis</span>
            </div>
            <div class="sec-item simulated">
              <i class="fas fa-eye" style="color:var(--warning);"></i>
              <span style="font-size:0.85rem;font-weight:600;color:var(--text-1);">Détection changement d'onglet</span>
              <span class="sim-tag">Simulation</span>
            </div>
            <div class="sec-item simulated">
              <i class="fas fa-video" style="color:var(--warning);"></i>
              <span style="font-size:0.85rem;font-weight:600;color:var(--text-1);">Surveillance Caméra</span>
              <span class="sim-tag">Simulation</span>
            </div>
          </div>
          <p style="font-size:0.8rem;color:var(--text-3);margin:0 0 16px;">Note: Les fonctionnalités en "Simulation" n'enregistrent pas réellement vos données biométriques dans cette version.</p>
          <button class="btn btn-primary btn-sm" onclick="nextStep(3)">Accepter la sécurité <i class="fas fa-shield-alt"></i></button>
        </div>
        
        <!-- Step 4 -->
        <div class="step-card" id="step4">
          <div class="step-header">
            <h3 class="step-title">4. Vérification finale</h3>
            <span class="step-badge">4 / 4</span>
          </div>
          <div style="margin-bottom:24px;">
            <label class="check-label">
              <input type="checkbox" id="chk1" onchange="checkFinal()">
              <span class="check-text">J'ai lu et compris les consignes de mon professeur.</span>
            </label>
            <label class="check-label">
              <input type="checkbox" id="chk2" onchange="checkFinal()">
              <span class="check-text">J'accepte les conditions de surveillance de l'épreuve.</span>
            </label>
            <label class="check-label">
              <input type="checkbox" id="chk3" onchange="checkFinal()">
              <span class="check-text">Je suis prêt(e) à commencer (la durée ne pourra pas être mise en pause).</span>
            </label>
          </div>
          <button class="btn btn-primary" id="btnStartExam" disabled style="width:100%;padding:14px;font-size:1.05rem;" onclick="startCountdown()">
            Démarrer la composition <i class="fas fa-play" style="margin-left:8px;"></i>
          </button>
        </div>
        
      </div>
    </div>
  </div>


  <!-- ==================== VIEW: ACTIVE EXAM ==================== -->
  <div id="viewActive" class="exam-view">
    <header class="exam-header">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="width:40px;height:40px;background:var(--grad-brand);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div>
          <h2 id="activeExamTitle" style="font-size:1.1rem;font-weight:800;margin:0 0 2px;">Titre</h2>
          <div id="activeExamStudent" style="font-size:0.75rem;color:var(--text-3);font-weight:600;">Étudiant</div>
        </div>
      </div>
      
      <div class="timer-box" id="examTimerDisplay">--:--</div>
      
      <button class="btn btn-outline" style="border-color:var(--danger);color:var(--danger);" onclick="showFinishModal()">
        Terminer l'épreuve
      </button>
    </header>
    
    <div class="exam-body">
      <!-- Nav Grid -->
      <aside class="exam-sidebar">
        <div style="padding:20px;border-bottom:1px solid var(--border);">
          <div style="font-size:0.8rem;font-weight:800;color:var(--text-2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Navigation</div>
          <div style="display:flex;gap:12px;font-size:0.75rem;color:var(--text-3);font-weight:600;">
            <div style="display:flex;align-items:center;gap:4px;"><div style="width:10px;height:10px;background:rgba(16,185,129,0.2);border:1px solid var(--success);border-radius:2px;"></div> Répondu</div>
            <div style="display:flex;align-items:center;gap:4px;"><div style="width:10px;height:10px;border:1px solid var(--warning);border-radius:2px;"></div> Marqué</div>
          </div>
        </div>
        <div class="q-grid" id="qGrid">
          <!-- Dynamically populated -->
        </div>
      </aside>
      
      <!-- Main Q -->
      <main class="exam-main">
        <div style="position:absolute;top:20px;right:20px;">
          <button class="btn btn-outline btn-sm" id="btnMark" onclick="toggleMark()">
            <i class="fas fa-flag"></i> Marquer pour revoir
          </button>
        </div>
        
        <div class="q-content">
          <div style="font-size:0.85rem;font-weight:800;color:var(--brand-1);margin-bottom:12px;" id="qNumberDisplay">Question 1 sur N</div>
          <h3 class="q-title" id="qText">Texte de la question...</h3>
          
          <div id="qOptions">
            <!-- Dynamically populated -->
          </div>
        </div>
        
        <footer class="exam-footer">
          <button class="btn btn-outline" id="btnPrevQ" onclick="navigateQ(-1)"><i class="fas fa-arrow-left"></i> Précédente</button>
          <div style="font-size:0.85rem;font-weight:600;color:var(--text-3);" id="qProgressText">Progression : 0 / N</div>
          <button class="btn btn-primary" id="btnNextQ" onclick="navigateQ(1)">Suivante <i class="fas fa-arrow-right"></i></button>
        </footer>
      </main>
    </div>
  </div>


  <!-- ==================== VIEW: FINISHED ==================== -->
  <div id="viewFinished" class="exam-view">
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;">
      <div style="width:80px;height:80px;background:rgba(16,185,129,0.1);color:var(--success);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:3rem;margin-bottom:24px;">
        <i class="fas fa-check"></i>
      </div>
      <h2 style="font-size:2.5rem;font-weight:900;color:var(--text-1);margin:0 0 16px;">Composition Terminée</h2>
      <p style="font-size:1.1rem;color:var(--text-2);max-width:500px;line-height:1.6;margin:0 0 32px;">
        Votre copie a bien été enregistrée et soumise à votre professeur. Le temps et vos réponses ont été scellés.
      </p>
      
      <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xl);padding:24px;display:flex;gap:32px;margin-bottom:40px;">
        <div>
          <div style="font-size:0.85rem;color:var(--text-3);font-weight:600;margin-bottom:4px;">Heure de soumission</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--text-1);" id="submitTime">--:--</div>
        </div>
        <div style="width:1px;background:var(--border);"></div>
        <div>
          <div style="font-size:0.85rem;color:var(--text-3);font-weight:600;margin-bottom:4px;">Questions répondues</div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--brand-1);" id="submitScore">-- / --</div>
        </div>
      </div>
      
      <button class="btn btn-primary" onclick="window.location.href='dashboard.html#overview'">Retour au Tableau de Bord</button>
    </div>
  </div>


  <!-- Overlays & Modals -->
  <div class="countdown-overlay" id="startCountdownOverlay">
    <div style="font-size:1.5rem;font-weight:800;color:var(--text-2);margin-bottom:20px;">L'épreuve commence dans</div>
    <div class="cd-number" id="cdNumber">3</div>
  </div>

  <div class="finish-modal" id="finishModal">
    <div class="modal-content">
      <i class="fas fa-exclamation-triangle" style="font-size:2.5rem;color:var(--warning);margin-bottom:16px;"></i>
      <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-1);margin:0 0 8px;">Êtes-vous sûr de vouloir terminer ?</h3>
      <p style="font-size:0.9rem;color:var(--text-2);margin:0 0 24px;" id="finishModalStats">
        -- / -- questions répondues.
      </p>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <button class="btn btn-primary" onclick="submitExam()">Soumettre définitivement</button>
        <button class="btn btn-ghost" onclick="document.getElementById('finishModal').classList.remove('show')">Retourner à l'épreuve</button>
      </div>
    </div>
  </div>

  <script type="module">
    import { authService } from './js/services/authService.js';
    
    // MOCK DATA FOR COMPOSITION
    const mockComposition = {
      code: 'CMP-7K4P92',
      title: 'Algorithmique Avancée & Structures de Données',
      subject: 'Informatique',
      teacher: 'Dr. K. AGBOTON',
      duration: 60, // in minutes
      questions: [
        { id: 1, text: "Quelle est la complexité temporelle moyenne du tri rapide (QuickSort) ?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correct: 1 },
        { id: 2, text: "Lequel de ces arbres garantit un équilibrage parfait ?", options: ["Arbre Binaire de Recherche", "Arbre AVL", "Arbre Rouge-Noir", "Tas Max"], correct: 1 },
        { id: 3, text: "Dans un graphe orienté, comment s'appelle un chemin qui part d'un sommet et y revient ?", options: ["Une chaîne", "Une forêt", "Un cycle", "Une composante connexe"], correct: 2 },
        { id: 4, text: "La structure de données LIFO (Last In First Out) correspond à :", options: ["Une file", "Une pile", "Un graphe", "Une liste chaînée"], correct: 1 },
        { id: 5, text: "Quel algorithme est utilisé pour trouver le plus court chemin dans un graphe pondéré positif ?", options: ["Prim", "Kruskal", "Dijkstra", "Bellman-Ford"], correct: 2 }
      ],
      rules: [
        "Lisez attentivement chaque question avant de répondre.",
        "Une seule tentative est autorisée.",
        "La durée de l'épreuve est de 60 minutes stricte.",
        "Toute sortie de la fenêtre d'examen sera signalée.",
        "Aucun document externe n'est autorisé."
      ]
    };

    let currentUser = null;
    let currentQIndex = 0;
    let studentAnswers = {}; // index -> optionIndex
    let markedQuestions = {}; // index -> boolean
    let timerInterval = null;
    let secondsRemaining = 0;

    document.addEventListener('DOMContentLoaded', () => {
      currentUser = authService.getUser() || { prenom: 'Étudiant', nom: 'UAC' };
      document.getElementById('studentNameBadge').textContent = `${currentUser.prenom} ${currentUser.nom}`;
      document.getElementById('activeExamStudent').textContent = `${currentUser.prenom} ${currentUser.nom}`;
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (!code || (code !== 'CMP-7K4P92' && code !== 'TEST26')) {
        alert('Code invalide ou expiré.');
        window.location.href = 'dashboard.html#overview';
        return;
      }
      
      initWaitingRoom(mockComposition);
    });

    // --- WAITING ROOM LOGIC ---
    function initWaitingRoom(comp) {
      document.getElementById('examTitle').textContent = comp.title;
      document.getElementById('examSubject').textContent = comp.subject;
      document.getElementById('examTeacher').textContent = comp.teacher;
      document.getElementById('examDuration').textContent = `${comp.duration} min`;
      document.getElementById('examQCount').textContent = `${comp.questions.length} QCM`;
      
      const rulesHtml = comp.rules.map(r => `<li>${r}</li>`).join('');
      document.getElementById('examRulesList').innerHTML = rulesHtml;
    }

    window.nextStep = function(currentStep) {
      document.getElementById('step' + currentStep).classList.add('completed');
      document.getElementById('step' + currentStep).classList.remove('active');
      const next = document.getElementById('step' + (currentStep + 1));
      if (next) next.classList.add('active');
    };

    window.checkFinal = function() {
      const c1 = document.getElementById('chk1').checked;
      const c2 = document.getElementById('chk2').checked;
      const c3 = document.getElementById('chk3').checked;
      document.getElementById('btnStartExam').disabled = !(c1 && c2 && c3);
    };

    window.startCountdown = function() {
      const overlay = document.getElementById('startCountdownOverlay');
      overlay.classList.add('show');
      const numEl = document.getElementById('cdNumber');
      let count = 3;
      
      const intv = setInterval(() => {
        count--;
        if (count > 0) {
          numEl.textContent = count;
        } else {
          clearInterval(intv);
          overlay.classList.remove('show');
          startExam();
        }
      }, 1000);
    };

    // --- ACTIVE EXAM LOGIC ---
    function startExam() {
      document.querySelectorAll('.exam-view').forEach(v => v.classList.remove('active'));
      document.getElementById('viewActive').classList.add('active');
      
      document.getElementById('activeExamTitle').textContent = mockComposition.title;
      
      // Try to enter fullscreen (simulation of security)
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(e => console.log("Fullscreen refused by browser"));
        }
      } catch(e){}

      // Init Grid
      const grid = document.getElementById('qGrid');
      grid.innerHTML = '';
      mockComposition.questions.forEach((q, i) => {
        const btn = document.createElement('button');
        btn.className = 'q-btn';
        btn.id = `qGridBtn-${i}`;
        btn.textContent = (i + 1).toString().padStart(2, '0');
        btn.onclick = () => loadQuestion(i);
        grid.appendChild(btn);
      });
      
      secondsRemaining = mockComposition.duration * 60;
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        secondsRemaining--;
        updateTimerDisplay();
        if (secondsRemaining <= 0) {
          clearInterval(timerInterval);
          submitExam();
        }
      }, 1000);

      loadQuestion(0);
    }

    function updateTimerDisplay() {
      const m = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
      const s = (secondsRemaining % 60).toString().padStart(2, '0');
      const el = document.getElementById('examTimerDisplay');
      el.textContent = `${m}:${s}`;
      
      if (secondsRemaining <= 300 && !el.classList.contains('urgent')) { // 5 minutes
        el.classList.add('urgent');
      }
    }

    window.loadQuestion = function(index) {
      currentQIndex = index;
      const q = mockComposition.questions[index];
      
      // Update Grid active state
      document.querySelectorAll('.q-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(`qGridBtn-${index}`).classList.add('active');
      
      document.getElementById('qNumberDisplay').textContent = `Question ${index + 1} sur ${mockComposition.questions.length}`;
      document.getElementById('qText').textContent = q.text;
      
      // Update mark button state
      const btnMark = document.getElementById('btnMark');
      if (markedQuestions[index]) {
        btnMark.innerHTML = `<i class="fas fa-flag"></i> Retirer la marque`;
        btnMark.classList.replace('btn-outline', 'btn-primary');
        btnMark.style.background = 'var(--warning)';
        btnMark.style.borderColor = 'var(--warning)';
      } else {
        btnMark.innerHTML = `<i class="fas fa-flag"></i> Marquer pour revoir`;
        btnMark.className = 'btn btn-outline btn-sm';
        btnMark.style = '';
      }

      // Render options
      const optContainer = document.getElementById('qOptions');
      optContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D', 'E'];
      
      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn' + (studentAnswers[index] === optIdx ? ' selected' : '');
        btn.innerHTML = `<div class="opt-letter">${letters[optIdx]}</div> <div>${optText}</div>`;
        btn.onclick = () => selectOption(optIdx);
        optContainer.appendChild(btn);
      });
      
      // Update Footer buttons
      document.getElementById('btnPrevQ').disabled = (index === 0);
      document.getElementById('btnNextQ').disabled = (index === mockComposition.questions.length - 1);
      
      updateProgressText();
    };

    window.selectOption = function(optIdx) {
      studentAnswers[currentQIndex] = optIdx;
      // Refresh current question visually
      loadQuestion(currentQIndex);
      // Update grid answered state
      document.getElementById(`qGridBtn-${currentQIndex}`).classList.add('answered');
      updateProgressText();
    };

    window.toggleMark = function() {
      markedQuestions[currentQIndex] = !markedQuestions[currentQIndex];
      const gridBtn = document.getElementById(`qGridBtn-${currentQIndex}`);
      if (markedQuestions[currentQIndex]) {
        gridBtn.classList.add('marked');
      } else {
        gridBtn.classList.remove('marked');
      }
      loadQuestion(currentQIndex); // refresh button state
    };

    window.navigateQ = function(dir) {
      const newIdx = currentQIndex + dir;
      if (newIdx >= 0 && newIdx < mockComposition.questions.length) {
        loadQuestion(newIdx);
      }
    };

    function updateProgressText() {
      const answeredCount = Object.keys(studentAnswers).length;
      document.getElementById('qProgressText').textContent = `Progression : ${answeredCount} / ${mockComposition.questions.length}`;
    }

    // --- SUBMISSION ---
    window.showFinishModal = function() {
      const answeredCount = Object.keys(studentAnswers).length;
      const total = mockComposition.questions.length;
      const stats = document.getElementById('finishModalStats');
      
      if (answeredCount === total) {
        stats.innerHTML = `<strong style="color:var(--success);">${answeredCount} / ${total} questions répondues.</strong><br>Vous avez complété l'épreuve.`;
      } else {
        stats.innerHTML = `<strong>${answeredCount} / ${total} questions répondues.</strong><br><span style="color:var(--danger);">Il vous reste ${total - answeredCount} questions sans réponse.</span>`;
      }
      
      document.getElementById('finishModal').classList.add('show');
    };

    window.submitExam = function() {
      document.getElementById('finishModal').classList.remove('show');
      clearInterval(timerInterval);
      
      // Exit fullscreen safely
      try {
        if (document.exitFullscreen) document.exitFullscreen().catch(e=>{});
      } catch(e){}
      
      document.querySelectorAll('.exam-view').forEach(v => v.classList.remove('active'));
      document.getElementById('viewFinished').classList.add('active');
      
      const now = new Date();
      document.getElementById('submitTime').textContent = now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
      document.getElementById('submitScore').textContent = `${Object.keys(studentAnswers).length} / ${mockComposition.questions.length}`;
    };

  </script>
</body>
</html>
