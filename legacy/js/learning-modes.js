// ============================================================
// CAMPUSLY — js/learning-modes.js
// Les 5 Modes d'Apprentissage Campusly :
// 1. QCM · 2. Question / Réponse · 3. Vrai / Faux · 4. Résumé · 5. Marathon Adaptatif
// ============================================================

import { adaptiveEngine } from './adaptive-engine.js';
import { campuslyCredits } from './credits.js';

export class LearningModesEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentMode = 'qcm'; // 'qcm' | 'open' | 'true_false' | 'summary' | 'marathon'
    this.session = {
      questions: [],
      currentIndex: 0,
      score: 0,
      userAnswers: {},
      marathonStreak: 0,
      marathonErrors: 0,
      totalAnswered: 0
    };
  }

  setMode(mode) {
    this.currentMode = mode;
    this.render();
  }

  startSession(questions, mode = 'qcm') {
    this.currentMode = mode;
    this.session = {
      questions,
      currentIndex: 0,
      score: 0,
      userAnswers: {},
      marathonStreak: 0,
      marathonErrors: 0,
      totalAnswered: 0
    };
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.currentMode === 'summary') {
      this.renderSummaryMode();
      return;
    }

    if (this.currentMode === 'marathon') {
      this.renderMarathonMode();
      return;
    }

    // Standard Question Modes (QCM, Open, True/False)
    if (!this.session.questions || this.session.questions.length === 0) {
      this.renderEmptyState();
      return;
    }

    if (this.session.currentIndex >= this.session.questions.length) {
      this.renderCompletedResults();
      return;
    }

    const q = this.session.questions[this.session.currentIndex];
    const total = this.session.questions.length;
    const current = this.session.currentIndex + 1;
    const progressPct = Math.round(((current - 1) / total) * 100);

    this.container.innerHTML = `
      <div class="rev-quiz-container" style="background:var(--grad-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:28px;">
        <div class="quiz-header" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(21,101,192,0.1);color:var(--brand-2);font-size:0.75rem;font-weight:700;padding:3px 10px;border-radius:var(--r-sm);text-transform:uppercase;margin-bottom:6px;">
              ${this.getModeBadgeLabel()}
            </div>
            <div class="quiz-matiere" style="font-size:1.1rem;font-weight:800;color:var(--text-1);">${q.chapter || 'Entraînement Académique'}</div>
          </div>
          <div style="font-size:0.85rem;font-weight:700;color:var(--text-3);">
            Question <span style="color:var(--brand-2);font-size:1rem;">${current}</span> / ${total}
          </div>
        </div>

        <div class="quiz-progress-bar" style="height:6px;background:var(--surface-2);border-radius:var(--r-full);overflow:hidden;margin-bottom:20px;">
          <div class="quiz-progress-fill" style="width:${progressPct}%;height:100%;background:var(--grad-brand);transition:width 0.3s ease;"></div>
        </div>

        <div class="quiz-question" style="font-size:1.1rem;font-weight:700;color:var(--text-1);line-height:1.6;margin-bottom:24px;">
          ${q.prompt}
        </div>

        <div id="quizQuestionBody">
          ${this.renderQuestionTypeInteractive(q)}
        </div>

        <div id="quizFeedbackBox" style="display:none;margin-top:20px;"></div>

        <div id="quizActionFooter" style="display:flex;justify-content:flex-end;margin-top:24px;">
          <button id="btnNextQuizQ" class="btn btn-primary" style="display:none;" onclick="window.learningModes.nextQuestion()">
            Question suivante →
          </button>
        </div>
      </div>
    `;
  }

  getModeBadgeLabel() {
    switch (this.currentMode) {
      case 'qcm': return 'Mode 1 · QCM';
      case 'open': return 'Mode 2 · Question / Réponse';
      case 'true_false': return 'Mode 3 · Vrai / Faux';
      case 'marathon': return 'Mode 5 · Marathon Adaptatif';
      default: return 'Mode d\'apprentissage';
    }
  }

  renderQuestionTypeInteractive(q) {
    if (q.type === 'qcm' || this.currentMode === 'qcm') {
      const opts = q.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
      return `
        <div class="quiz-options" style="display:flex;flex-direction:column;gap:10px;">
          ${opts.map((opt, idx) => `
            <button class="quiz-option" data-idx="${idx}" onclick="window.learningModes.handleQcmAnswer(${idx})" style="display:flex;align-items:center;gap:14px;padding:14px 18px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text-1);font-family:var(--font-sans);font-size:0.92rem;text-align:left;cursor:pointer;transition:all 0.2s ease;">
              <span class="option-letter" style="width:28px;height:28px;background:var(--surface-2);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;flex-shrink:0;">
                ${String.fromCharCode(65 + idx)}
              </span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    if (q.type === 'true_false' || this.currentMode === 'true_false') {
      return `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <button class="quiz-option tf-opt" onclick="window.learningModes.handleTrueFalseAnswer(true)" style="padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);cursor:pointer;text-align:center;font-size:1.1rem;font-weight:700;color:var(--text-1);transition:all 0.2s ease;">
            <div style="font-size:2rem;color:var(--success);margin-bottom:8px;"><i class="fas fa-check"></i></div>
            VRAI
          </button>
          <button class="quiz-option tf-opt" onclick="window.learningModes.handleTrueFalseAnswer(false)" style="padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);cursor:pointer;text-align:center;font-size:1.1rem;font-weight:700;color:var(--text-1);transition:all 0.2s ease;">
            <div style="font-size:2rem;color:var(--danger);margin-bottom:8px;"><i class="fas fa-xmark"></i></div>
            FAUX
          </button>
        </div>
      `;
    }

    if (q.type === 'open' || this.currentMode === 'open') {
      return `
        <div>
          <label style="display:block;font-size:0.82rem;font-weight:700;color:var(--text-2);margin-bottom:8px;">Formulez librement votre réponse avant d'afficher la solution attendue :</label>
          <textarea id="openAnswerInput" placeholder="Saisissez votre raisonnement, démonstration ou définition..." style="width:100%;min-height:110px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-md);padding:14px;color:var(--text-1);font-family:var(--font-sans);font-size:0.9rem;resize:vertical;margin-bottom:14px;"></textarea>
          <button class="btn btn-outline" onclick="window.learningModes.revealOpenAnswer()" style="width:100%;">
            <i class="fas fa-eye"></i> Vérifier et révéler les critères attendus
          </button>
        </div>
      `;
    }

    return '';
  }

  handleQcmAnswer(selectedIdx) {
    const q = this.session.questions[this.session.currentIndex];
    const isCorrect = Number(selectedIdx) === Number(q.correctAnswer);
    this.session.userAnswers[this.session.currentIndex] = selectedIdx;
    if (isCorrect) this.session.score += 1;

    // UI Feedback
    const buttons = this.container.querySelectorAll('.quiz-option');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === Number(q.correctAnswer)) {
        btn.style.background = 'rgba(16,185,129,0.15)';
        btn.style.borderColor = 'var(--success)';
        btn.style.color = 'var(--success)';
      } else if (idx === selectedIdx && !isCorrect) {
        btn.style.background = 'rgba(239,68,68,0.15)';
        btn.style.borderColor = 'var(--danger)';
        btn.style.color = 'var(--danger)';
      }
    });

    this.showFeedback(isCorrect, q.explanation);
  }

  handleTrueFalseAnswer(userBool) {
    const q = this.session.questions[this.session.currentIndex];
    const correctBool = q.correctAnswer === true || q.correctAnswer === 'true' || q.correctAnswer === 0 || q.correctAnswer === 'Vrai';
    const isCorrect = userBool === correctBool;
    if (isCorrect) this.session.score += 1;

    const buttons = this.container.querySelectorAll('.tf-opt');
    buttons.forEach(btn => btn.disabled = true);

    this.showFeedback(isCorrect, q.explanation);
  }

  revealOpenAnswer() {
    const q = this.session.questions[this.session.currentIndex];
    const text = document.getElementById('openAnswerInput')?.value || '';
    const isDecent = text.trim().length > 15;
    if (isDecent) this.session.score += 1;

    const fbBox = document.getElementById('quizFeedbackBox');
    if (fbBox) {
      fbBox.style.display = 'block';
      fbBox.innerHTML = `
        <div style="background:var(--surface-2);border:1px solid var(--border-2);border-radius:var(--r-md);padding:18px;">
          <div style="font-weight:700;color:var(--text-1);font-size:0.95rem;margin-bottom:8px;">
            <i class="fas fa-bullseye" style="color:var(--brand-2);margin-right:6px;"></i> Critères de correction attendus :
          </div>
          <p style="font-size:0.88rem;color:var(--text-2);line-height:1.6;margin-bottom:12px;">${q.expectedCriteria || q.explanation}</p>
          <div style="font-size:0.82rem;color:var(--text-3);border-top:1px solid var(--border);padding-top:10px;">
            Explication : ${q.explanation}
          </div>
        </div>
      `;
    }
    const nextBtn = document.getElementById('btnNextQuizQ');
    if (nextBtn) nextBtn.style.display = 'inline-flex';
  }

  showFeedback(isCorrect, explanation) {
    const fbBox = document.getElementById('quizFeedbackBox');
    if (fbBox) {
      fbBox.style.display = 'block';
      fbBox.innerHTML = `
        <div style="background:${isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};border:1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};border-radius:var(--r-md);padding:16px;">
          <div style="font-weight:800;color:${isCorrect ? 'var(--success)' : 'var(--danger)'};font-size:0.95rem;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
            ${isCorrect ? '<i class="fas fa-circle-check"></i> Excellente réponse !' : '<i class="fas fa-circle-xmark"></i> Réponse inexacte'}
          </div>
          <div style="font-size:0.86rem;color:var(--text-1);line-height:1.6;">
            ${explanation || 'Retenez bien cette notion pour vos examens.'}
          </div>
        </div>
      `;
    }
    const nextBtn = document.getElementById('btnNextQuizQ');
    if (nextBtn) nextBtn.style.display = 'inline-flex';
  }

  nextQuestion() {
    this.session.currentIndex += 1;
    this.render();
  }

  renderCompletedResults() {
    const total = this.session.questions.length;
    const score = this.session.score;
    const pct = Math.round((score / total) * 100);

    // Save to adaptive learning engine
    const currentQ = this.session.questions[0];
    const subject = currentQ?.chapter || 'Informatique & Sciences';
    const resultStats = adaptiveEngine.recordQuizResult(subject, currentQ?.chapter, score, total);

    let statusColor = 'var(--brand-1)';
    let statusText = 'Bon travail !';
    if (pct >= 80) {
      statusColor = 'var(--success)';
      statusText = 'Excellente maîtrise !';
    } else if (pct < 50) {
      statusColor = 'var(--danger)';
      statusText = 'Notion à retravailler';
    }

    this.container.innerHTML = `
      <div class="rev-results" style="padding:40px 20px;text-align:center;">
        <div style="background:var(--grad-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:36px;max-width:520px;margin:0 auto;">
          <div style="width:110px;height:110px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem;font-weight:900;border:4px solid ${statusColor};color:${statusColor};background:var(--surface);">
            ${pct}%
          </div>
          <h3 style="font-size:1.35rem;font-weight:800;color:var(--text-1);margin-bottom:6px;">${statusText}</h3>
          <p style="font-size:0.88rem;color:var(--text-2);margin-bottom:24px;">
            Vous avez obtenu <strong>${score} sur ${total}</strong> questions correctes.
          </p>

          <div style="display:flex;justify-content:center;gap:24px;margin-bottom:24px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:16px 0;">
            <div>
              <div style="font-size:1.4rem;font-weight:800;color:var(--accent);">+${resultStats.earnedXp} XP</div>
              <div style="font-size:0.75rem;color:var(--text-3);">XP Gagnés</div>
            </div>
            <div>
              <div style="font-size:1.4rem;font-weight:800;color:var(--brand-2);">${resultStats.currentLevel.name}</div>
              <div style="font-size:0.75rem;color:var(--text-3);">Niveau Actuel</div>
            </div>
            <div>
              <div style="font-size:1.4rem;font-weight:800;color:#F57C00;"><i class="fa-solid fa-fire" style="color:var(--accent);"></i> ${resultStats.streak} j</div>
              <div style="font-size:0.75rem;color:var(--text-3);">Série Quotidienne</div>
            </div>
          </div>

          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="window.learningModes.startSession(window.learningModes.session.questions, window.learningModes.currentMode)">
              <i class="fas fa-rotate-left"></i> Recommencer
            </button>
            <button class="btn btn-accent" onclick="window.learningModes.startMarathon()">
              <i class="fas fa-bolt"></i> Lancer le Marathon Adaptatif
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Mode 4: Résumé Pédagogique ──────────────────────────────
  renderSummaryMode() {
    this.container.innerHTML = `
      <div style="background:var(--grad-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:28px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:12px;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,124,0,0.12);color:var(--accent);font-size:0.75rem;font-weight:700;padding:3px 10px;border-radius:var(--r-sm);text-transform:uppercase;margin-bottom:6px;">
              Mode 4 · Résumé Pédagogique
            </div>
            <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-1);">Synthèses Pédagogiques Campusly AI</h3>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-outline btn-sm summary-len-btn active" data-len="court" onclick="window.learningModes.fetchSummary('court')">Court</button>
            <button class="btn btn-outline btn-sm summary-len-btn" data-len="standard" onclick="window.learningModes.fetchSummary('standard')">Standard</button>
            <button class="btn btn-outline btn-sm summary-len-btn" data-len="detaille" onclick="window.learningModes.fetchSummary('detaille')">Détaillé</button>
          </div>
        </div>

        <div id="summaryContentBox" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;line-height:1.7;color:var(--text-1);font-size:0.92rem;">
          <div style="font-weight:700;font-size:1.1rem;color:var(--brand-2);margin-bottom:12px;">
            📖 Fiche Essentielle : Notions Clés & Démonstrations
          </div>
          <p style="color:var(--text-2);margin-bottom:16px;">
            Sélectionnez le niveau de détail souhaité pour adapter le résumé à vos révisions d'examens.
          </p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div style="background:var(--bg-2);padding:14px;border-radius:var(--r-md);">
              <strong style="color:var(--accent);">Points Fondamentaux :</strong>
              <ul style="margin-top:6px;padding-left:18px;font-size:0.85rem;color:var(--text-2);">
                <li>Conditions préalables d'application</li>
                <li>Démarches de résolution types</li>
              </ul>
            </div>
            <div style="background:var(--bg-2);padding:14px;border-radius:var(--r-md);">
              <strong style="color:var(--success);">Astuces Examens :</strong>
              <ul style="margin-top:6px;padding-left:18px;font-size:0.85rem;color:var(--text-2);">
                <li>Vérification systématique des cas limites</li>
                <li>Rédaction rigoureuse des hypothèses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async fetchSummary(length) {
    const box = document.getElementById('summaryContentBox');
    if (!box) return;
    box.innerHTML = `<div style="text-align:center;padding:30px;"><span class="summary-spinner"></span> Génération du résumé ${length}…</div>`;

    document.querySelectorAll('.summary-len-btn').forEach(b => b.classList.toggle('active', b.dataset.len === length));

    try {
      const res = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: 'Algorithmique & Systèmes', length })
      });
      const data = await res.json();
      box.innerHTML = `
        <div style="white-space:pre-wrap;font-size:0.92rem;line-height:1.7;color:var(--text-1);">
          ${data.summary}
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<div style="color:var(--danger);">Erreur lors de la génération du résumé.</div>`;
    }
  }

  // ── Mode 5: Marathon Adaptatif (Infinite smart queue) ───────
  async startMarathon() {
    this.currentMode = 'marathon';
    this.session.marathonStreak = 0;
    this.session.marathonErrors = 0;
    this.session.totalAnswered = 0;
    await this.fetchNextMarathonQuestion();
  }

  renderMarathonMode() {
    this.startMarathon();
  }

  async fetchNextMarathonQuestion() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="background:var(--grad-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:28px;text-align:center;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,124,0,0.15);color:var(--accent);font-size:0.78rem;font-weight:800;padding:4px 12px;border-radius:var(--r-full);text-transform:uppercase;">
            <i class="fas fa-bolt"></i> Marathon Adaptatif
          </div>
          <div style="display:flex;gap:16px;font-size:0.85rem;font-weight:700;">
            <span style="color:var(--success);"><i class="fa-solid fa-fire" style="color:var(--accent);"></i> Série : ${this.session.marathonStreak}</span>
            <span style="color:var(--text-2);">Total : ${this.session.totalAnswered}</span>
          </div>
        </div>
        <div style="padding:40px 0;"><span class="summary-spinner"></span> L'IA sélectionne une question selon vos lacunes…</div>
      </div>
    `;

    const weak = adaptiveEngine.getWeakTopics().map(t => t.name);

    try {
      const res = await fetch('/api/ai/adaptive-next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Algorithmique & Mathématiques',
          weakTopics: weak,
          questionsAnswered: this.session.totalAnswered
        })
      });
      const data = await res.json();
      if (data.success && data.question) {
        this.renderMarathonQuestionCard(data.question);
      }
    } catch (e) {
      console.error(e);
    }
  }

  renderMarathonQuestionCard(q) {
    this.container.innerHTML = `
      <div style="background:var(--grad-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:28px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,124,0,0.15);color:var(--accent);font-size:0.75rem;font-weight:800;padding:4px 10px;border-radius:var(--r-full);text-transform:uppercase;margin-bottom:6px;">
              <i class="fas fa-bolt"></i> Marathon Adaptatif
            </div>
            <div style="font-size:0.8rem;color:var(--brand-2);font-weight:600;">
              ${q.adaptiveReason || `Cible : ${q.chapter}`}
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:16px;background:var(--surface);padding:6px 14px;border-radius:var(--r-full);border:1px solid var(--border);">
            <span style="font-size:0.85rem;font-weight:800;color:var(--accent);"><i class="fa-solid fa-fire"></i> ${this.session.marathonStreak} d'affilée</span>
            <button class="btn btn-ghost btn-sm" onclick="window.learningModes.finishMarathon()">Terminer</button>
          </div>
        </div>

        <div style="font-size:1.15rem;font-weight:700;color:var(--text-1);line-height:1.6;margin-bottom:24px;">
          ${q.prompt}
        </div>

        <div class="quiz-options" style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
          ${(q.options || []).map((opt, idx) => `
            <button class="quiz-option" onclick="window.learningModes.handleMarathonAnswer(${idx}, ${q.correctAnswer}, '${(q.explanation || '').replace(/'/g, "\\'")}', '${q.chapter}')" style="display:flex;align-items:center;gap:14px;padding:14px 18px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text-1);font-family:var(--font-sans);font-size:0.92rem;text-align:left;cursor:pointer;transition:all 0.2s ease;">
              <span style="width:28px;height:28px;background:var(--surface-2);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;flex-shrink:0;">
                ${String.fromCharCode(65 + idx)}
              </span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>

        <div id="marathonFeedback" style="display:none;margin-top:16px;"></div>

        <div style="display:flex;justify-content:flex-end;margin-top:20px;">
          <button id="btnMarathonNext" class="btn btn-accent btn-lg" style="display:none;" onclick="window.learningModes.fetchNextMarathonQuestion()">
            Question Suivante <i class="fas fa-arrow-right" style="margin-left:6px;"></i>
          </button>
        </div>
      </div>
    `;
  }

  handleMarathonAnswer(selectedIdx, correctIdx, explanation, chapter) {
    const isCorrect = Number(selectedIdx) === Number(correctIdx);
    this.session.totalAnswered += 1;

    if (isCorrect) {
      this.session.marathonStreak += 1;
    } else {
      this.session.marathonErrors += 1;
      this.session.marathonStreak = 0;
    }

    adaptiveEngine.recordQuizResult('Marathon', chapter, isCorrect ? 1 : 0, 1);

    const buttons = this.container.querySelectorAll('.quiz-option');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === Number(correctIdx)) {
        btn.style.background = 'rgba(16,185,129,0.15)';
        btn.style.borderColor = 'var(--success)';
        btn.style.color = 'var(--success)';
      } else if (idx === selectedIdx && !isCorrect) {
        btn.style.background = 'rgba(239,68,68,0.15)';
        btn.style.borderColor = 'var(--danger)';
        btn.style.color = 'var(--danger)';
      }
    });

    const fb = document.getElementById('marathonFeedback');
    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = `
        <div style="background:${isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};border:1px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'};border-radius:var(--r-md);padding:14px;">
          <strong style="color:${isCorrect ? 'var(--success)' : 'var(--danger)'};display:flex;align-items:center;gap:6px;">
            ${isCorrect ? '<i class="fas fa-circle-check"></i> Parfait !' : '<i class="fas fa-circle-xmark"></i> Erreur enregistrée par le moteur adaptatif'}
          </strong>
          <p style="font-size:0.85rem;color:var(--text-1);margin-top:4px;">${explanation}</p>
        </div>
      `;
    }

    const next = document.getElementById('btnMarathonNext');
    if (next) next.style.display = 'inline-flex';
  }

  finishMarathon() {
    this.container.innerHTML = `
      <div style="text-align:center;padding:40px 20px;background:var(--grad-card);border:1px solid var(--border);border-radius:var(--r-xl);">
        <h3 style="font-size:1.4rem;font-weight:800;color:var(--text-1);margin-bottom:8px;">
          <i class="fas fa-bolt" style="color:var(--accent);margin-right:6px;"></i> Session Marathon Terminée
        </h3>
        <p style="color:var(--text-2);font-size:0.9rem;margin-bottom:24px;">
          Vous avez répondu à <strong>${this.session.totalAnswered} questions</strong> adaptatives.
        </p>
        <button class="btn btn-primary" onclick="window.location.href='dashboard.html'">Consulter mes points faibles au Dashboard</button>
      </div>
    `;
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="rev-empty">
        <div class="rev-empty-icon"><i class="fas fa-robot" style="font-size:2rem;"></i></div>
        <h3>Prêt pour votre révision ?</h3>
        <p>Sélectionnez un mode ci-dessus ou importez un cours avec Campusly AI pour débuter.</p>
        <button class="btn btn-accent btn-lg" onclick="window.learningModes.startMarathon()">
          <i class="fas fa-bolt"></i> Lancer le Marathon Adaptatif
        </button>
      </div>
    `;
  }
}

export const learningModes = new LearningModesEngine('learningModesContainer');
window.learningModes = learningModes;
