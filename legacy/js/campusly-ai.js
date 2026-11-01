// ============================================================
// CAMPUSLY 2.0 — js/campusly-ai.js
// Workflow complet 7 étapes Campusly AI (Import -> Analyse -> Config -> Génération -> Éditeur -> Validation -> Export)
// ============================================================

import { creditService } from './services/creditService.js';
import { aiService } from './services/aiService.js';

export class CampuslyAIWizard {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.currentStep = 1;
    this.extractedData = null;
    this.rawText = '';
    this.quizConfig = {
      subject: 'Informatique',
      faculty: 'FAST',
      chapter: '',
      difficulty: 'Intermédiaire',
      questionType: 'all',
      questionCount: 5,
      language: 'fr'
    };
    this.generatedQuestions = [];
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  goToStep(step) {
    this.currentStep = step;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="campusly-ai-card" style="background:var(--grad-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:28px;box-shadow:var(--shadow-md);">
        ${this.renderStepper()}
        <div class="wizard-step-content" style="margin-top:24px;">
          ${this.renderCurrentStep()}
        </div>
      </div>
    `;
    this.attachEventListeners();
  }

  renderStepper() {
    const steps = [
      { num: 1, label: 'Document' },
      { num: 2, label: 'Analyse IA' },
      { num: 3, label: 'Configuration' },
      { num: 4, label: 'Génération' },
      { num: 5, label: 'Édition & Contrôle' },
      { num: 6, label: 'Validation' },
      { num: 7, label: 'Partage & Pratique' }
    ];

    return `
      <div class="campusly-stepper" style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:20px;overflow-x:auto;gap:12px;">
        ${steps.map(s => `
          <div class="step-badge-wrap ${this.currentStep === s.num ? 'active' : (this.currentStep > s.num ? 'completed' : '')}" style="display:flex;align-items:center;gap:8px;cursor:${this.currentStep > s.num ? 'pointer' : 'default'};opacity:${this.currentStep === s.num ? '1' : (this.currentStep > s.num ? '0.9' : '0.4')};">
            <span style="width:28px;height:28px;border-radius:50%;background:${this.currentStep === s.num ? 'var(--grad-brand)' : (this.currentStep > s.num ? 'var(--success)' : 'var(--surface-3)')};color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;flex-shrink:0;">
              ${this.currentStep > s.num ? '✓' : s.num}
            </span>
            <span style="font-size:0.8rem;font-weight:${this.currentStep === s.num ? '700' : '500'};color:var(--text-1);white-space:nowrap;">
              ${s.label}
            </span>
          </div>
        `).join('<div style="flex:1;height:2px;background:var(--border);min-width:12px;"></div>')}
      </div>
    `;
  }

  renderCurrentStep() {
    switch (this.currentStep) {
      case 1: return this.renderStep1Upload();
      case 2: return this.renderStep2Analysis();
      case 3: return this.renderStep3Config();
      case 4: return this.renderStep4Generating();
      case 5: return this.renderStep5Editor();
      case 6: return this.renderStep6Validation();
      case 7: return this.renderStep7Export();
      default: return this.renderStep1Upload();
    }
  }

  // ── Step 1: Upload ──────────────────────────────────────────
  renderStep1Upload() {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <h3 style="font-size:1.25rem;font-weight:700;color:var(--text-1);">
            <i class="fas fa-file-upload" style="color:var(--brand-2);margin-right:8px;"></i>
            Étape 1 : Importer un document ou copier un cours
          </h3>
          <span class="campusly-credits-pill" style="display:inline-flex;align-items:center;gap:6px;background:var(--surface);border:1px solid var(--border);padding:4px 12px;border-radius:var(--r-full);font-size:0.8rem;">
            ⚡ 5 crédits requis
          </span>
        </div>
        <p style="color:var(--text-2);font-size:0.88rem;margin-bottom:20px;">
          Importez vos PDF de cours, polycopiés, anciennes épreuves, manuels ou collez directement vos notes de révision.
        </p>

        <div id="dropZone" style="border:2px dashed var(--border-2);border-radius:var(--r-lg);padding:36px 20px;text-align:center;background:var(--surface);cursor:pointer;transition:all 0.2s ease;margin-bottom:20px;">
          <input type="file" id="fileInput" accept=".pdf,.txt,.doc,.docx" style="display:none;" />
          <div style="font-size:2.4rem;color:var(--brand-2);margin-bottom:12px;"><i class="fas fa-cloud-arrow-up"></i></div>
          <div style="font-weight:700;color:var(--text-1);font-size:1rem;margin-bottom:4px;">Glissez-déposez votre document ici</div>
          <div style="font-size:0.8rem;color:var(--text-3);">Formats acceptés : PDF, TXT, DOCX (Max 15 Mo)</div>
          <button type="button" class="btn btn-outline btn-sm" style="margin-top:16px;" onclick="document.getElementById('fileInput').click()">Parcourir mes fichiers</button>
          <div id="selectedFileName" style="display:none;margin-top:14px;font-weight:600;color:var(--success);font-size:0.85rem;"></div>
        </div>

        <div style="margin-bottom:24px;">
          <label style="display:block;font-size:0.82rem;font-weight:700;color:var(--text-2);margin-bottom:8px;">Ou collez directement votre texte ou résumé de cours :</label>
          <textarea id="rawTextInput" placeholder="Exemple : Chapitre 3 — Arbres AVL et équilibrage par rotations gauche et droite. Propriété fondamentale : la différence de hauteur entre le sous-arbre gauche et droit ne dépasse jamais 1..." style="width:100%;min-height:140px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-md);padding:14px;color:var(--text-1);font-family:var(--font-sans);font-size:0.88rem;resize:vertical;"></textarea>
        </div>

        <div style="display:flex;justify-content:flex-end;">
          <button id="btnStartAnalysis" class="btn btn-accent btn-lg" style="gap:8px;">
            Analyser avec Campusly AI <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  // ── Step 2: Analysis Preview ────────────────────────────────
  renderStep2Analysis() {
    const data = this.extractedData || {
      title: 'Support Pédagogique UAC',
      summary: 'Analyse synthétique des notions fondamentales.',
      estimatedLevel: 'Intermédiaire',
      chapters: ['Chapitre 1 : Fondements', 'Chapitre 2 : Démonstrations & Cas Pratiques'],
      keyConcepts: [
        { concept: 'Principe Fondamental', definition: 'Axiome central du cours.', importance: 'Fondamentale' }
      ],
      difficultyAreas: ['Pièges fréquents aux examens']
    };

    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <h3 style="font-size:1.25rem;font-weight:700;color:var(--text-1);">
            <i class="fas fa-brain" style="color:var(--accent);margin-right:8px;"></i>
            Étape 2 : Analyse pédagogique Campusly AI
          </h3>
          <span style="background:rgba(16,185,129,0.15);border:1px solid var(--success);color:var(--success);padding:4px 10px;border-radius:var(--r-full);font-size:0.75rem;font-weight:700;">
            Analyse complétée
          </span>
        </div>

        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;margin-bottom:20px;">
          <div style="font-size:1.1rem;font-weight:800;color:var(--text-1);margin-bottom:6px;">${data.title}</div>
          <p style="font-size:0.88rem;color:var(--text-2);line-height:1.6;">${data.summary}</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;">
            <div style="font-weight:700;font-size:0.85rem;color:var(--brand-2);margin-bottom:8px;">
              <i class="fas fa-list-check" style="margin-right:6px;"></i> Concepts Clés Extraits
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${(data.keyConcepts || []).map(c => `
                <div style="font-size:0.8rem;color:var(--text-1);"><strong>• ${c.concept || c}</strong> : ${c.definition || ''}</div>
              `).join('')}
            </div>
          </div>

          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;">
            <div style="font-weight:700;font-size:0.85rem;color:var(--danger);margin-bottom:8px;">
              <i class="fas fa-triangle-exclamation" style="margin-right:6px;"></i> Pièges & Points de Vigilance
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${(data.difficultyAreas || []).map(d => `
                <div style="font-size:0.8rem;color:var(--text-2);">⚠ ${d}</div>
              `).join('')}
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;">
          <button class="btn btn-ghost" onclick="window.campuslyWizard.goToStep(1)">← Importer un autre document</button>
          <button class="btn btn-primary btn-lg" onclick="window.campuslyWizard.goToStep(3)">
            Configurer le Quiz →
          </button>
        </div>
      </div>
    `;
  }

  // ── Step 3: Config ──────────────────────────────────────────
  renderStep3Config() {
    const chapters = this.extractedData?.chapters || ['Généralités', 'Applications'];

    return `
      <div>
        <h3 style="font-size:1.25rem;font-weight:700;color:var(--text-1);margin-bottom:8px;">
          <i class="fas fa-sliders" style="color:var(--brand-1);margin-right:8px;"></i>
          Étape 3 : Configurer les paramètres du quiz
        </h3>
        <p style="color:var(--text-2);font-size:0.88rem;margin-bottom:24px;">
          Définissez le format, le niveau d'exigence et le nombre de questions souhaités.
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
          <div>
            <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-2);margin-bottom:6px;">Nombre de questions</label>
            <select id="cfgCount" class="form-select" style="width:100%;">
              <option value="5" selected>5 questions (Rapide)</option>
              <option value="10">10 questions (Standard)</option>
              <option value="15">15 questions (Examen Blanc)</option>
            </select>
          </div>

          <div>
            <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-2);margin-bottom:6px;">Niveau de difficulté</label>
            <select id="cfgDiff" class="form-select" style="width:100%;">
              <option value="Débutant">Débutant (Rappels de cours)</option>
              <option value="Intermédiaire" selected>Intermédiaire (Niveau Examen UAC)</option>
              <option value="Avancé">Avancé (Cas complexes)</option>
            </select>
          </div>

          <div>
            <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-2);margin-bottom:6px;">Type de questions</label>
            <select id="cfgType" class="form-select" style="width:100%;">
              <option value="all" selected>Mixte (QCM, Vrai/Faux, Ouvertes)</option>
              <option value="qcm">100% QCM (Choix Multiples)</option>
              <option value="true_false">100% Vrai / Faux</option>
              <option value="open">100% Questions Ouvertes</option>
            </select>
          </div>

          <div>
            <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-2);margin-bottom:6px;">Chapitre ciblé</label>
            <select id="cfgChapter" class="form-select" style="width:100%;">
              <option value="">Tous les chapitres du document</option>
              ${chapters.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;">
          <button class="btn btn-ghost" onclick="window.campuslyWizard.goToStep(2)">← Retour</button>
          <button id="btnGenerateQuiz" class="btn btn-accent btn-lg" style="gap:8px;">
            <i class="fas fa-wand-magic-sparkles"></i> Générer avec Campusly AI (10 crédits)
          </button>
        </div>
      </div>
    `;
  }

  // ── Step 4: Generating Screen ───────────────────────────────
  renderStep4Generating() {
    return `
      <div style="text-align:center;padding:60px 20px;">
        <div style="width:64px;height:64px;border:4px solid var(--surface-2);border-top-color:var(--brand-1);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 24px;"></div>
        <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-1);margin-bottom:8px;">Campusly AI génère vos questions pédagogiques…</h3>
        <p style="color:var(--text-2);font-size:0.9rem;max-width:440px;margin:0 auto 16px;">
          Création de questions calibrées sur le programme académique, formulation des explications et vérification des critères.
        </p>
        <span style="display:inline-block;background:var(--surface);border:1px solid var(--border);color:var(--brand-2);font-size:0.8rem;padding:4px 12px;border-radius:var(--r-full);">
          ⚡ Analyse sémantique & barème en cours
        </span>
      </div>
    `;
  }

  // ── Step 5: Interactive Full Editor ─────────────────────────
  renderStep5Editor() {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
          <div>
            <h3 style="font-size:1.25rem;font-weight:700;color:var(--text-1);">
              <i class="fas fa-edit" style="color:var(--brand-2);margin-right:8px;"></i>
              Étape 5 : Édition & Contrôle Maître
            </h3>
            <p style="font-size:0.85rem;color:var(--text-2);">
              Vous gardez le contrôle total : modifiez, supprimez, réorganisez ou ajoutez des questions.
            </p>
          </div>
          <button id="btnAddCustomQ" class="btn btn-outline btn-sm">
            <i class="fas fa-plus"></i> Ajouter une question manuelle
          </button>
        </div>

        <div id="questionsEditorList" style="display:flex;flex-direction:column;gap:16px;margin-bottom:24px;">
          ${this.generatedQuestions.map((q, idx) => this.renderQuestionEditorCard(q, idx)).join('')}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;">
          <button class="btn btn-ghost" onclick="window.campuslyWizard.goToStep(3)">← Modifier paramètres</button>
          <button id="btnValidateQuiz" class="btn btn-primary btn-lg">
            Valider le Quiz (${this.generatedQuestions.length} questions) →
          </button>
        </div>
      </div>
    `;
  }

  renderQuestionEditorCard(q, idx) {
    return `
      <div class="q-edit-card" data-index="${idx}" style="background:var(--surface);border:1px solid var(--border-2);border-radius:var(--r-lg);padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="width:28px;height:28px;border-radius:var(--r-sm);background:var(--brand-1);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;">
              ${idx + 1}
            </span>
            <span style="font-size:0.75rem;font-weight:700;color:var(--accent);background:rgba(245,124,0,0.1);padding:3px 8px;border-radius:var(--r-sm);text-transform:uppercase;">
              ${q.type === 'qcm' ? 'QCM' : (q.type === 'true_false' ? 'Vrai/Faux' : 'Question Ouverte')}
            </span>
            <span style="font-size:0.75rem;color:var(--text-3);">${q.chapter || 'Général'}</span>
          </div>

          <div style="display:flex;gap:6px;">
            <button class="btn-icon-sm" onclick="window.campuslyWizard.deleteQuestion(${idx})" title="Supprimer la question" style="background:var(--surface-2);border:1px solid var(--border);color:var(--danger);padding:6px 10px;border-radius:var(--r-sm);cursor:pointer;font-size:0.78rem;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-3);margin-bottom:4px;">Énoncé de la question :</label>
          <input type="text" value="${(q.prompt || '').replace(/"/g, '&quot;')}" onchange="window.campuslyWizard.updateQuestionField(${idx}, 'prompt', this.value)" style="width:100%;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:10px 12px;color:var(--text-1);font-family:var(--font-sans);font-size:0.9rem;" />
        </div>

        ${q.type === 'qcm' ? `
          <div style="margin-bottom:12px;">
            <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-3);margin-bottom:6px;">Options de réponse (Cochez la bonne réponse) :</label>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${(q.options || []).map((opt, oIdx) => `
                <div style="display:flex;align-items:center;gap:8px;">
                  <input type="radio" name="correct_${idx}" ${Number(q.correctAnswer) === oIdx ? 'checked' : ''} onchange="window.campuslyWizard.updateQuestionField(${idx}, 'correctAnswer', ${oIdx})" style="accent-color:var(--brand-1);cursor:pointer;" />
                  <input type="text" value="${(opt || '').replace(/"/g, '&quot;')}" onchange="window.campuslyWizard.updateOption(${idx}, ${oIdx}, this.value)" style="flex:1;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 10px;color:var(--text-1);font-size:0.85rem;" />
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="margin-bottom:4px;">
          <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-3);margin-bottom:4px;">Explication pédagogique :</label>
          <textarea onchange="window.campuslyWizard.updateQuestionField(${idx}, 'explanation', this.value)" style="width:100%;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 12px;color:var(--text-2);font-size:0.82rem;resize:vertical;min-height:50px;">${q.explanation || ''}</textarea>
        </div>
      </div>
    `;
  }

  // ── Step 6: Validation ──────────────────────────────────────
  renderStep6Validation() {
    return `
      <div style="text-align:center;padding:30px 20px;">
        <div style="width:72px;height:72px;border-radius:50%;background:rgba(16,185,129,0.15);border:2px solid var(--success);color:var(--success);display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 20px;">
          <i class="fas fa-check"></i>
        </div>
        <h3 style="font-size:1.4rem;font-weight:800;color:var(--text-1);margin-bottom:8px;">Quiz validé et prêt à l'emploi !</h3>
        <p style="color:var(--text-2);font-size:0.9rem;max-width:500px;margin:0 auto 24px;">
          Votre contenu pédagogique comporte <strong>${this.generatedQuestions.length} questions</strong> révisées et calibrées.
        </p>

        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-ghost" onclick="window.campuslyWizard.goToStep(5)">Modifier</button>
          <button class="btn btn-primary btn-lg" onclick="window.campuslyWizard.goToStep(7)">Finaliser et Exploiter →</button>
        </div>
      </div>
    `;
  }

  // ── Step 7: Export & Play ───────────────────────────────────
  renderStep7Export() {
    return `
      <div>
        <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-1);margin-bottom:8px;">
          <i class="fas fa-rocket" style="color:var(--brand-2);margin-right:8px;"></i>
          Étape 7 : Choisissez comment exploiter ce quiz
        </h3>
        <p style="color:var(--text-2);font-size:0.88rem;margin-bottom:24px;">
          Jouez directement en session de révision, sauvegardez dans votre bibliothèque, ou publiez dans votre classe.
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px;">
          <div class="action-choice-card" onclick="window.campuslyWizard.playQuizNow()" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;text-align:center;cursor:pointer;transition:all 0.2s ease;">
            <div style="font-size:2rem;color:var(--accent);margin-bottom:12px;"><i class="fas fa-play"></i></div>
            <div style="font-weight:700;color:var(--text-1);font-size:1rem;margin-bottom:4px;">Jouer Immédiatement</div>
            <div style="font-size:0.78rem;color:var(--text-3);">Session de révision interactive avec scoring</div>
          </div>

          <div class="action-choice-card" onclick="window.campuslyWizard.saveToLibrary()" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;text-align:center;cursor:pointer;transition:all 0.2s ease;">
            <div style="font-size:2rem;color:var(--brand-1);margin-bottom:12px;"><i class="fas fa-bookmark"></i></div>
            <div style="font-weight:700;color:var(--text-1);font-size:1rem;margin-bottom:4px;">Sauvegarder</div>
            <div style="font-size:0.78rem;color:var(--text-3);">Ajouter à mes quiz personnels</div>
          </div>

          <div class="action-choice-card" onclick="window.campuslyWizard.assignToClassroom()" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;text-align:center;cursor:pointer;transition:all 0.2s ease;">
            <div style="font-size:2rem;color:var(--success);margin-bottom:12px;"><i class="fas fa-chalkboard-user"></i></div>
            <div style="font-weight:700;color:var(--text-1);font-size:1rem;margin-bottom:4px;">Ajouter à une Classroom</div>
            <div style="font-size:0.78rem;color:var(--text-3);">Partager avec vos étudiants ou élèves</div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;">
          <button class="btn btn-ghost" onclick="window.campuslyWizard.goToStep(1)">Créer un autre Quiz</button>
          <button class="btn btn-outline" onclick="window.location.href='dashboard.html'">Accéder à mon Dashboard</button>
        </div>
      </div>
    `;
  }

  // ── Actions & Helpers ───────────────────────────────────────
  attachEventListeners() {
    const fileInput = document.getElementById('fileInput');
    const rawTextInput = document.getElementById('rawTextInput');
    const btnStartAnalysis = document.getElementById('btnStartAnalysis');
    const btnGenerateQuiz = document.getElementById('btnGenerateQuiz');
    const btnAddCustomQ = document.getElementById('btnAddCustomQ');
    const btnValidateQuiz = document.getElementById('btnValidateQuiz');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const el = document.getElementById('selectedFileName');
          if (el) {
            el.textContent = `Fichier sélectionné : ${file.name} (${Math.round(file.size / 1024)} Ko)`;
            el.style.display = 'block';
          }
        }
      });
    }

    if (btnStartAnalysis) {
      btnStartAnalysis.addEventListener('click', async () => {
        const text = rawTextInput?.value.trim() || '';
        const file = fileInput?.files?.[0];
        if (!text && !file) {
          alert('Veuillez importer un fichier ou coller un extrait de cours.');
          return;
        }

        try {
          await creditService.consume(5, 'Analyse de document Campusly AI');
        } catch (creditErr) {
          creditService.showCreditModal();
          return;
        }

        btnStartAnalysis.disabled = true;
        btnStartAnalysis.innerHTML = `<span class="summary-spinner"></span> Analyse en cours…`;

        setTimeout(() => {
          this.extractedData = aiService.analyzeDocument(text || 'Document UAC');
          this.rawText = text;
          this.goToStep(2);
        }, 1200);
      });
    }

    if (btnGenerateQuiz) {
      btnGenerateQuiz.addEventListener('click', async () => {
        const count = Number(document.getElementById('cfgCount')?.value || 5);
        const diff = document.getElementById('cfgDiff')?.value || 'Intermédiaire';
        const type = document.getElementById('cfgType')?.value || 'all';
        const chapter = document.getElementById('cfgChapter')?.value || '';

        this.quizConfig.questionCount = count;
        this.quizConfig.difficulty = diff;
        this.quizConfig.questionType = type;
        this.quizConfig.chapter = chapter;

        try {
          await creditService.consume(10, 'Génération de quiz Campusly AI');
        } catch (e) {
          creditService.showCreditModal();
          return;
        }

        this.goToStep(4); // Generating step

        setTimeout(() => {
          const res = aiService.generateQuiz({
            sourceText: this.rawText,
            subject: this.quizConfig.subject,
            faculty: this.quizConfig.faculty,
            chapter: this.quizConfig.chapter,
            questionCount: this.quizConfig.questionCount,
            difficulty: this.quizConfig.difficulty,
            questionType: this.quizConfig.questionType
          });
          this.generatedQuestions = res.questions || [];
          this.goToStep(5);
        }, 1500);
      });
    }

    if (btnAddCustomQ) {
      btnAddCustomQ.addEventListener('click', () => {
        const newQ = {
          id: `q_custom_${Date.now()}`,
          type: 'qcm',
          chapter: this.quizConfig.chapter || 'Question Manuelle',
          difficulty: this.quizConfig.difficulty,
          prompt: 'Nouvelle question rédigée manuellement',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'Explication détaillée du formateur.'
        };
        this.generatedQuestions.push(newQ);
        this.render();
      });
    }

    if (btnValidateQuiz) {
      btnValidateQuiz.addEventListener('click', () => {
        this.goToStep(6);
      });
    }
  }

  updateQuestionField(idx, field, value) {
    if (this.generatedQuestions[idx]) {
      this.generatedQuestions[idx][field] = value;
    }
  }

  updateOption(qIdx, optIdx, value) {
    if (this.generatedQuestions[qIdx]?.options?.[optIdx] !== undefined) {
      this.generatedQuestions[qIdx].options[optIdx] = value;
    }
  }

  deleteQuestion(idx) {
    if (confirm('Voulez-vous supprimer cette question ?')) {
      this.generatedQuestions.splice(idx, 1);
      this.render();
    }
  }

  playQuizNow() {
    if (window.startCustomQuizSession) {
      window.startCustomQuizSession(this.generatedQuestions);
    } else {
      localStorage.setItem('campusly_active_quiz', JSON.stringify(this.generatedQuestions));
      window.location.href = 'revision.html?play=custom';
    }
  }

  saveToLibrary() {
    const saved = JSON.parse(localStorage.getItem('campusly_saved_quizzes') || '[]');
    saved.unshift({
      id: `quiz_${Date.now()}`,
      title: this.extractedData?.title || 'Quiz Personnalisé',
      questions: this.generatedQuestions,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('campusly_saved_quizzes', JSON.stringify(saved));
    if (window.showToast) window.showToast('Quiz sauvegardé dans votre bibliothèque !', 'success');
  }

  assignToClassroom() {
    window.location.href = 'classrooms.html?action=assign';
  }
}

export const campuslyWizard = new CampuslyAIWizard('campuslyAIWizardContainer');
window.CampuslyAIWizard = CampuslyAIWizard;
