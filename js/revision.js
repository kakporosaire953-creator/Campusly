// ============================================================
// CAMPUSLY — revision.js (Supabase Edge Functions)
// ============================================================
import { supabase } from "./supabase-config.js";
import { SUPABASE_FUNCTIONS_URL } from "./supabase-config.js";
import { saveQuizResult, getQuizResults } from "./supabase-db.js";

const EDGE_URL = `${SUPABASE_FUNCTIONS_URL}/generate-quiz`;

let currentQuestions = [];
let currentIndex     = 0;
let score            = 0;
let currentSujet     = "";
let currentFaculte   = "";
let isGenerating     = false;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateQuizBtn")?.addEventListener("click", handleGenerateQuiz);
  document.getElementById("quitQuizBtn")?.addEventListener("click", quitQuiz);
  document.getElementById("nextBtn")?.addEventListener("click", nextQuestion);
  document.getElementById("retryBtn")?.addEventListener("click", () => handleGenerateQuiz());
  document.getElementById("changeSubjectBtn")?.addEventListener("click", quitQuiz);

  document.addEventListener("authReady", async ({ detail }) => {
    if (detail.user) await loadProgression(detail.user.id);
  });
});

// ── Génération du quiz ───────────────────────────────────────
async function handleGenerateQuiz() {
  const sujetInput    = document.getElementById("quizSujetInput");
  const faculteSelect = document.getElementById("filterFaculteRev");
  const sujet   = sujetInput?.value?.trim() || currentSujet;
  const faculte = faculteSelect?.value || currentFaculte;

  if (!sujet) { showToast("Entrez un sujet de révision.", "info"); sujetInput?.focus(); return; }
  if (isGenerating) return;
  isGenerating = true;

  currentSujet   = sujet;
  currentFaculte = faculte;
  showLoader(true);
  hideAllPanels();

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(EDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ sujet, faculte, nbQuestions: 7 }),
    });

    const result = await res.json();

    if (!res.ok) {
      if (res.status === 429) {
        showToast("Limite de 3 quiz gratuits atteinte aujourd'hui. Passez Premium !", "info");
        showPanel("revEmpty");
        showUpgradePrompt();
      } else {
        showToast("Service IA temporairement indisponible. Réessayez.", "info");
        showPanel("revEmpty");
      }
      return;
    }

    currentQuestions = result.questions;
    currentIndex     = 0;
    score            = 0;

    showPanel("quizContainer");
    document.getElementById("quizMatiere").textContent = sujet;
    document.getElementById("quizMeta").textContent =
      `${currentQuestions.length} questions · IA GPT-4o-mini${faculte ? " · " + faculte : ""}`;
    document.getElementById("questionTotal").textContent = `sur ${currentQuestions.length}`;
    renderQuestion();

  } catch (err) {
    console.error("Erreur génération quiz:", err);
    showToast("Service IA temporairement indisponible. Réessayez.", "info");
    showPanel("revEmpty");
  } finally {
    isGenerating = false;
    showLoader(false);
  }
}

// ── Rendu des questions ──────────────────────────────────────
function renderQuestion() {
  const q       = currentQuestions[currentIndex];
  const pct     = (currentIndex / currentQuestions.length) * 100;
  const letters = ["A", "B", "C", "D"];

  document.getElementById("quizProgressFill").style.width = `${pct}%`;
  document.getElementById("questionIndex").textContent    = `Question ${currentIndex + 1}`;
  document.getElementById("quizQuestion").textContent     = q.question;
  document.getElementById("quizFeedback").style.display   = "none";
  document.getElementById("nextBtn").style.display        = "none";

  document.getElementById("quizOptions").innerHTML = q.options.map((opt, i) =>
    `<button class="quiz-option" onclick="selectAnswer(${i})">
      <span class="option-letter">${letters[i]}</span>${opt}
    </button>`
  ).join("");
}

window.selectAnswer = function(index) {
  const q        = currentQuestions[currentIndex];
  const options  = document.querySelectorAll(".quiz-option");
  const feedback = document.getElementById("quizFeedback");
  const isCorrect = index === q.reponseCorrecte;

  options.forEach(btn => btn.disabled = true);
  options[q.reponseCorrecte].classList.add("correct");
  if (!isCorrect) options[index].classList.add("wrong");

  feedback.style.display = "block";
  feedback.className = `quiz-feedback ${isCorrect ? "correct-fb" : "wrong-fb"}`;
  feedback.innerHTML = isCorrect
    ? `<strong>Correct.</strong> ${q.explication}`
    : `<strong>Incorrect.</strong> La bonne réponse est : <strong>${q.options[q.reponseCorrecte]}</strong>. ${q.explication}`;

  if (isCorrect) score++;

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.style.display = "inline-flex";
  nextBtn.textContent   = currentIndex < currentQuestions.length - 1 ? "Question suivante" : "Voir les résultats";
};

function nextQuestion() {
  currentIndex++;
  if (currentIndex < currentQuestions.length) renderQuestion();
  else showResults();
}

// ── Résultats ────────────────────────────────────────────────
async function showResults() {
  const total = currentQuestions.length;
  const pct   = Math.round((score / total) * 100);

  showPanel("quizResults");
  document.getElementById("quizProgressFill").style.width = "100%";

  const circle = document.getElementById("resultsCircle");
  circle.className = "results-score-circle " +
    (pct >= 80 ? "excellent" : pct >= 60 ? "good" : pct >= 40 ? "average" : "low");
  document.getElementById("resultsScoreText").textContent = `${pct}%`;

  const msgs = [
    [80, "Excellent résultat",       "Vous maîtrisez bien ce sujet. Continuez sur cette lancée."],
    [60, "Bon résultat",             "Bonne base. Quelques révisions supplémentaires vous mèneront à l'excellence."],
    [40, "Résultat moyen",           "Des lacunes identifiées. Révisez les points mal maîtrisés."],
    [0,  "Des efforts nécessaires",  "Ce sujet nécessite une révision approfondie."],
  ];
  const [, title, desc] = msgs.find(([min]) => pct >= min);
  document.getElementById("resultsTitle").textContent = title;
  document.getElementById("resultsDesc").textContent  = desc;

  document.getElementById("resultsBreakdown").innerHTML = `
    <div class="breakdown-item"><div class="breakdown-value" style="color:var(--success);">${score}</div><div class="breakdown-label">Correctes</div></div>
    <div class="breakdown-item"><div class="breakdown-value" style="color:var(--danger);">${total - score}</div><div class="breakdown-label">Incorrectes</div></div>
    <div class="breakdown-item"><div class="breakdown-value">${total}</div><div class="breakdown-label">Total</div></div>
  `;

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    try {
      await saveQuizResult(session.user.id, { sujet: currentSujet, score, total, faculte: currentFaculte });
      await loadProgression(session.user.id);
    } catch (e) { console.error("Erreur sauvegarde quiz:", e); }
  }
}

// ── Progression ──────────────────────────────────────────────
async function loadProgression(uid) {
  try {
    const results   = await getQuizResults(uid);
    const container = document.getElementById("progressionList");
    const statQuiz  = document.getElementById("totalQuizDone");
    const statAvg   = document.getElementById("avgScore");
    const statMat   = document.getElementById("totalMatieres");

    if (statQuiz) statQuiz.textContent = results.length;

    if (!results.length) {
      if (container) container.innerHTML = '<p style="font-size:0.82rem;color:var(--gray-500);">Aucune progression. Commencez un quiz.</p>';
      if (statAvg) statAvg.textContent = "—";
      if (statMat) statMat.textContent = "0";
      return;
    }

    const avg    = Math.round(results.reduce((a, r) => a + (r.score / r.total) * 100, 0) / results.length);
    const sujets = [...new Set(results.map(r => r.sujet))];

    if (statAvg) statAvg.textContent = `${avg}%`;
    if (statMat) statMat.textContent = sujets.length;

    if (container) {
      container.innerHTML = sujets.slice(0, 5).map(sujet => {
        const sResults = results.filter(r => r.sujet === sujet);
        const sPct = Math.round(sResults.reduce((a, r) => a + (r.score / r.total) * 100, 0) / sResults.length);
        return `<div class="progression-item">
          <div class="progression-label"><span>${sujet}</span><span class="progression-pct">${sPct}%</span></div>
          <div class="progress-bar"><div class="progress-fill" style="width:${sPct}%"></div></div>
        </div>`;
      }).join("");
    }
  } catch (e) { console.error("Erreur chargement progression:", e); }
}

// ── Helpers UI ───────────────────────────────────────────────
function hideAllPanels() {
  ["revEmpty", "quizContainer", "quizResults"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

function showPanel(id) {
  hideAllPanels();
  const el = document.getElementById(id);
  if (el) el.style.display = id === "quizResults" ? "flex" : "block";
}

function showLoader(visible) {
  let loader = document.getElementById("quizLoader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "quizLoader";
    loader.className = "quiz-loader";
    loader.innerHTML = `<div class="loader-spinner"></div><p>L'IA génère votre quiz…</p>`;
    document.querySelector(".revision-main")?.appendChild(loader);
  }
  loader.style.display = visible ? "flex" : "none";
}

function showUpgradePrompt() {
  const el = document.getElementById("revEmpty");
  if (!el) return;
  el.innerHTML += `
    <div style="margin-top:20px;padding:16px;background:var(--primary-light);border-radius:12px;text-align:center;">
      <p style="font-weight:600;margin-bottom:12px;">Passez Premium pour des quiz illimités</p>
      <a href="dashboard.html#abonnement" class="btn btn-accent">Voir les offres</a>
    </div>`;
}

function quitQuiz() {
  currentSujet = "";
  showPanel("revEmpty");
}

function showToast(msg, type = "info") {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.className = `toast ${type} show`;
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 3500);
}
