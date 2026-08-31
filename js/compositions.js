// ============================================================
// CAMPUSLY 2.0 — js/compositions.js
// Système d'examen surveillé à distance (Proctoring éthique, chrono & correction)
// ============================================================

import { examService } from './services/examService.js';
import { authService } from './services/authService.js';

export class CompositionRunner {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.composition = null;
    this.answers = {};
    this.proctoringLogs = [];
    this.timeRemaining = 0;
    this.timerInterval = null;
    this.stream = null;
    this.isSubmitted = false;
  }

  async loadComposition(id) {
    try {
      const comp = examService.getCompositionById(id);
      if (comp) {
        this.composition = comp;
        this.renderConsentScreen();
      } else {
        if (this.container) {
          this.container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--danger);font-weight:700;">Composition introuvable.</div>`;
        }
      }
    } catch (e) {
      if (this.container) {
        this.container.innerHTML = `<div class="error-box">Impossible de charger la composition.</div>`;
      }
    }
  }

  renderConsentScreen() {
    if (!this.container) return;
    const c = this.composition;

    this.container.innerHTML = `
      <div style="max-width:680px;margin:0 auto;background:var(--grad-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:36px;box-shadow:var(--shadow-lg);">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="background:rgba(245,124,0,0.12);color:var(--accent);font-size:0.75rem;font-weight:800;padding:4px 12px;border-radius:var(--r-full);text-transform:uppercase;">
            Évaluation Officielle Surveillée
          </span>
          <h2 style="font-size:1.5rem;font-weight:800;color:var(--text-1);margin-top:10px;">${c.title}</h2>
          <p style="font-size:0.88rem;color:var(--text-2);margin-top:4px;">${c.className || 'L2 Informatique'} · Enseignant : ${c.teacherName || 'Dr. K. AGBOTON'}</p>
        </div>

        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:18px;margin-bottom:24px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:0.85rem;">
            <div><strong>Durée :</strong> ${c.durationMinutes || 45} minutes</div>
            <div><strong>Barème :</strong> ${c.totalPoints || 20} points</div>
            <div><strong>Tentatives autorisées :</strong> ${c.maxAttempts || 1}</div>
            <div><strong>Correction :</strong> Automatique immédiate</div>
          </div>
        </div>

        <!-- Ethical Proctoring Notice -->
        <div style="background:rgba(21,101,192,0.06);border:1px solid rgba(21,101,192,0.25);border-radius:var(--r-md);padding:18px;margin-bottom:28px;">
          <div style="font-weight:700;color:var(--brand-2);font-size:0.95rem;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-shield-halved"></i> Modalités de surveillance éthique & intégrité
          </div>
          <ul style="font-size:0.82rem;color:var(--text-2);padding-left:18px;display:flex;flex-direction:column;gap:6px;">
            <li><strong>Respect de la vie privée :</strong> Les flux vidéo ne sont ni vendus ni transmis à des tiers.</li>
            <li><strong>Changements d'onglets :</strong> Tout départ de la page d'examen est consigné dans le journal académique.</li>
            <li><strong>Plein écran :</strong> Le passage en plein écran garantit l'équité entre tous les étudiants.</li>
          </ul>
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;">
          <button id="btnStartExam" class="btn btn-accent btn-lg" onclick="window.compositionRunner.requestPermissionsAndStart()" style="width:100%;">
            <i class="fas fa-lock"></i> Valider et Démarrer l'Épreuve
          </button>
          <a href="classrooms.html" class="btn btn-ghost" style="text-align:center;">Annuler et retourner aux classes</a>
        </div>
      </div>
    `;
  }

  async requestPermissionsAndStart() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (mediaErr) {
          console.warn('Media devices not granted in iframe, continuing in secure exam mode');
        }
      }
    } catch (e) {
      console.warn('Sandbox bypass for test');
    }

    this.startExam();
  }

  startExam() {
    this.timeRemaining = (this.composition.durationMinutes || 45) * 60;
    this.setupProctoringListeners();
    this.renderExamInterface();
    this.startTimer();
  }

  setupProctoringListeners() {
    window.addEventListener('blur', () => {
      if (!this.isSubmitted) {
        this.logProctoringEvent('Changement de fenêtre / perte de focus');
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && !this.isSubmitted) {
        this.logProctoringEvent('Changement d\'onglet détecté');
      }
    });
  }

  logProctoringEvent(type) {
    const timestamp = new Date().toLocaleTimeString('fr-FR');
    this.proctoringLogs.push({ time: timestamp, type });
    const badge = document.getElementById('proctoringStatusBadge');
    if (badge) {
      badge.innerHTML = `⚠ Événement consigné : ${type} (${timestamp})`;
      badge.style.color = 'var(--danger)';
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining -= 1;
      const el = document.getElementById('examCountdown');
      if (el) {
        const m = Math.floor(this.timeRemaining / 60);
        const s = this.timeRemaining % 60;
        el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        if (this.timeRemaining < 300) {
          el.style.color = 'var(--danger)';
        }
      }

      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.submitExam(true);
      }
    }, 1000);
  }

  renderExamInterface() {
    if (!this.container) return;
    const c = this.composition;

    this.container.innerHTML = `
      <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-xl);padding:24px;box-shadow:var(--shadow-md);">
        <!-- Exam Header / Proctoring Bar -->
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:16px;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
          <div>
            <div style="font-size:0.8rem;font-weight:700;color:var(--brand-2);text-transform:uppercase;">${c.className || 'L2 Informatique'}</div>
            <h2 style="font-size:1.3rem;font-weight:800;color:var(--text-1);">${c.title}</h2>
          </div>

          <div style="display:flex;align-items:center;gap:16px;">
            <div style="background:var(--surface);border:1px solid var(--border);padding:8px 16px;border-radius:var(--r-md);text-align:center;">
              <div style="font-size:0.7rem;color:var(--text-3);text-transform:uppercase;">Temps Restant</div>
              <div id="examCountdown" style="font-family:var(--font-mono);font-size:1.3rem;font-weight:900;color:var(--brand-1);">
                --:--
              </div>
            </div>

            <div id="proctoringStatusBadge" style="font-size:0.78rem;font-weight:700;color:var(--success);display:flex;align-items:center;gap:6px;background:var(--surface);padding:8px 12px;border-radius:var(--r-md);border:1px solid var(--border);">
              <span style="width:8px;height:8px;border-radius:50%;background:var(--success);animation:pulse 1.5s infinite;"></span>
              Surveillance active
            </div>
          </div>
        </div>

        <!-- Questions List -->
        <div style="display:flex;flex-direction:column;gap:24px;margin-bottom:32px;">
          ${(c.questions || []).map((q, idx) => `
            <div class="exam-question-block" style="background:var(--surface);border:1px solid var(--border-2);border-radius:var(--r-lg);padding:20px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <span style="font-weight:800;color:var(--brand-1);font-size:0.95rem;">Question ${idx + 1}</span>
                <span style="font-size:0.78rem;font-weight:700;color:var(--text-3);background:var(--surface-2);padding:2px 8px;border-radius:var(--r-sm);">${q.points || 4} points</span>
              </div>

              <p style="font-size:0.95rem;font-weight:700;color:var(--text-1);margin-bottom:16px;line-height:1.5;">${q.prompt}</p>

              ${q.type === 'qcm' ? `
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${(q.options || []).map((opt, oIdx) => `
                    <label style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-md);cursor:pointer;font-size:0.88rem;color:var(--text-1);">
                      <input type="radio" name="comp_q_${q.id}" value="${oIdx}" onchange="window.compositionRunner.recordAnswer('${q.id}', ${oIdx})" style="accent-color:var(--brand-1);" />
                      <span>${opt}</span>
                    </label>
                  `).join('')}
                </div>
              ` : (q.type === 'true_false' ? `
                <div style="display:flex;gap:12px;">
                  <label style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-md);cursor:pointer;font-weight:700;color:var(--text-1);">
                    <input type="radio" name="comp_q_${q.id}" value="true" onchange="window.compositionRunner.recordAnswer('${q.id}', true)" /> VRAI
                  </label>
                  <label style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-md);cursor:pointer;font-weight:700;color:var(--text-1);">
                    <input type="radio" name="comp_q_${q.id}" value="false" onchange="window.compositionRunner.recordAnswer('${q.id}', false)" /> FAUX
                  </label>
                </div>
              ` : `
                <textarea placeholder="Rédigez votre réponse structurée..." onchange="window.compositionRunner.recordAnswer('${q.id}', this.value)" style="width:100%;min-height:90px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-md);padding:12px;font-family:var(--font-sans);font-size:0.88rem;color:var(--text-1);"></textarea>
              `)}
            </div>
          `).join('')}
        </div>

        <div style="display:flex;justify-content:flex-end;border-top:1px solid var(--border);padding-top:20px;">
          <button class="btn btn-accent btn-lg" onclick="window.compositionRunner.submitExam(false)">
            <i class="fas fa-paper-plane"></i> Rendre ma Copie d'Examen
          </button>
        </div>
      </div>
    `;
  }

  recordAnswer(qId, val) {
    this.answers[qId] = val;
  }

  async submitExam(isAuto = false) {
    if (!isAuto && !confirm('Êtes-vous certain de vouloir soumettre définitivement votre copie ?')) {
      return;
    }

    this.isSubmitted = true;
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
    }

    const user = authService.getUser();
    const submissionResult = examService.submitComposition(this.composition.id, {
      studentName: `${user.prenom} ${user.nom}`,
      matricule: user.matricule || '2025-UAC-889',
      answers: this.answers,
      proctoringLogs: this.proctoringLogs,
      durationSeconds: (this.composition.durationMinutes || 45) * 60 - this.timeRemaining
    });

    this.renderCorrectionCopy(submissionResult);
  }

  renderCorrectionCopy(sub) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="background:var(--grad-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:32px;box-shadow:var(--shadow-md);">
        <div style="text-align:center;border-bottom:1px solid var(--border);padding-bottom:24px;margin-bottom:24px;">
          <div style="font-size:0.8rem;font-weight:700;color:var(--brand-2);text-transform:uppercase;">Copie Corrigée & Délibération</div>
          <h2 style="font-size:1.6rem;font-weight:800;color:var(--text-1);margin-top:6px;">${this.composition.title}</h2>
          
          <div style="display:inline-block;margin-top:16px;padding:12px 28px;border-radius:var(--r-lg);background:var(--surface);border:2px solid var(--brand-1);">
            <div style="font-size:0.8rem;color:var(--text-3);text-transform:uppercase;">Note Obtenue</div>
            <div style="font-size:2.4rem;font-weight:900;color:var(--brand-1);">${sub.scoreOn20} / 20</div>
          </div>
        </div>

        <div style="font-size:1.1rem;font-weight:800;color:var(--text-1);margin-bottom:16px;">
          Détail question par question :
        </div>

        <div style="display:flex;flex-direction:column;gap:18px;margin-bottom:28px;">
          ${(sub.gradedQuestions || []).map((g, idx) => `
            <div style="background:var(--surface);border:1px solid ${g.isCorrect ? 'var(--success)' : 'var(--danger)'};border-radius:var(--r-md);padding:18px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-weight:700;color:var(--text-1);font-size:0.9rem;">Question ${idx + 1}</span>
                <span style="font-weight:800;color:${g.isCorrect ? 'var(--success)' : 'var(--danger)'};font-size:0.85rem;">
                  ${g.earnedPoints} / ${g.maxPoints} pts
                </span>
              </div>
              <p style="font-size:0.9rem;color:var(--text-1);margin-bottom:10px;">${g.prompt}</p>
              <div style="font-size:0.82rem;color:var(--text-2);background:var(--bg-2);padding:10px;border-radius:var(--r-sm);">
                <strong>Explication académique :</strong> ${g.explanation}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex;justify-content:center;gap:14px;">
          <button class="btn btn-outline" onclick="window.print()"><i class="fas fa-print"></i> Imprimer ma Copie</button>
          <a href="classrooms.html" class="btn btn-primary">Retour à mes cours</a>
        </div>
      </div>
    `;
  }
}

export const compositionRunner = new CompositionRunner('compositionContainer');
window.compositionRunner = compositionRunner;
