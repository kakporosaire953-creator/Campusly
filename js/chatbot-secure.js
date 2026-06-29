// ============================================================
// CAMPUSLY — chatbot-secure.js (Version sécurisée)
// ============================================================
import { requireAuth } from './auth-guard.js';
import { supabase } from './supabase.js';
import { FUNCTIONS_URL } from './supabase.js';
import { initAutoLogout } from './auto-logout.js';
import { showToast } from './utils.js';
import { handleError, retryWithBackoff } from './error-handler.js';
import { escapeHtml } from './sanitizer.js';

const EDGE_BASE = FUNCTIONS_URL;

let mode = "chat";
let messages = [];
let isLoading = false;
let quizData = null;
let quizAnswered = 0;
let quizScore = 0;
let sessions = JSON.parse(localStorage.getItem("campusly_chat_sessions") || "[]");

// ── Initialisation ───────────────────────────────────────────
export function initChatbot() {
  requireAuth((user) => {
    const navEl = document.getElementById("navActions");
    if (navEl) navEl.innerHTML = `
      <a href="dashboard.html" class="btn btn-ghost btn-sm">Dashboard</a>
      <button onclick="window.signOutUser()" class="btn btn-outline btn-sm">Déconnexion</button>`;
    renderHistory();
    initAutoLogout();
  });

  window.signOutUser = async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  };

  // Event listeners
  document.getElementById("chatInput")?.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  document.getElementById("chatInput")?.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 120) + "px";
  });
}

// ── Mode ─────────────────────────────────────────────────────
export function setMode(m) {
  mode = m;
  document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(`mode${m.charAt(0).toUpperCase()+m.slice(1)}Btn`)?.classList.add("active");
  
  const ta = document.getElementById("chatInput");
  if (!ta) return;
  
  if (m === "quiz") ta.placeholder = "Ex : Génère 50 questions sur la Microéconomie S1…";
  else if (m === "explain") ta.placeholder = "Ex : Explique-moi le principe de la partie double…";
  else ta.placeholder = "Posez votre question ou demandez un quiz…";
}

// ── Envoi message ────────────────────────────────────────────
export async function sendMessage() {
  const input = document.getElementById("chatInput");
  const text = input?.value.trim();
  
  if (!text || isLoading) return;

  input.value = "";
  input.style.height = "auto";
  hideWelcome();
  isLoading = true;
  
  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) sendBtn.disabled = true;

  // Ajouter message utilisateur
  messages.push({ role: "user", content: text });
  appendMsg("user", text);

  // Typing indicator
  const typingId = appendTyping();

  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Utiliser retry pour les appels critiques
    const result = await retryWithBackoff(async () => {
      const res = await fetch(`${EDGE_BASE}/groq-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          mode: mode === "quiz" ? "quiz" : "chat",
          messages: messages.slice(-20),
          model: "balanced"
        }),
      });
      
      if (!res.ok) {
        throw new Error(`Erreur API: ${res.status}`);
      }
      
      return res.json();
    }, 3, 1000);

    removeTyping(typingId);
    const content = result.content;
    messages.push({ role: "assistant", content });

    // Détecter si c'est un quiz JSON
    if (mode === "quiz" || (content.trim().startsWith("{") && content.includes("questions"))) {
      try {
        const parsed = JSON.parse(content.trim());
        if (parsed.questions?.length) {
          renderQuizBlock(parsed.questions);
          saveSession(text, `Quiz de ${parsed.questions.length} questions`);
        } else {
          appendMsg("ai", content);
        }
      } catch {
        appendMsg("ai", content);
      }
    } else {
      appendMsg("ai", content);
      saveSession(text, content.slice(0, 60) + "…");
    }

  } catch (err) {
    removeTyping(typingId);
    handleError(err, {
      showToUser: true,
      customMessage: "Impossible de contacter l'assistant IA. Vérifiez votre connexion."
    });
    appendMsg("ai", `⚠ Erreur : ${err.message}`);
  } finally {
    isLoading = false;
    if (sendBtn) sendBtn.disabled = false;
  }
}

// ── Suggestions ──────────────────────────────────────────────
export function sendSuggestion(text) {
  const input = document.getElementById("chatInput");
  if (input) {
    input.value = text;
    sendMessage();
  }
}

// ── Rendu quiz ───────────────────────────────────────────────
function renderQuizBlock(questions) {
  quizData = questions;
  quizAnswered = 0;
  quizScore = 0;

  const div = document.createElement("div");
  div.className = "msg ai";
  
  // Sécuriser toutes les données du quiz
  const safeQuestions = questions.map((q, qi) => {
    const safeQuestion = escapeHtml(q.question);
    const safeOptions = q.options.map(o => escapeHtml(o));
    const safeExplication = escapeHtml(q.explication);
    
    return `
      <div class="quiz-q" id="qq-${qi}">
        <div class="quiz-q-text">${qi+1}. ${safeQuestion}</div>
        <div class="quiz-opts">
          ${safeOptions.map((o, oi) => `
            <button class="quiz-opt" id="qo-${qi}-${oi}" onclick="window.answerQuiz(${qi},${oi})">
              <span class="quiz-opt-letter">${["A","B","C","D"][oi]}</span>${o}
            </button>`).join("")}
        </div>
        <div class="quiz-explication" id="qe-${qi}">💡 ${safeExplication}</div>
      </div>`;
  }).join("");
  
  div.innerHTML = `
    <div class="msg-avatar"><i class="fas fa-graduation-cap"></i></div>
    <div style="flex:1;max-width:720px;">
      <div class="quiz-block">
        <div class="quiz-block-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Quiz — ${questions.length} questions
        </div>
        <div id="quizQuestionsContainer">${safeQuestions}</div>
        <div class="quiz-score-bar" id="quizScoreBar" style="display:none;">
          <span>Score final</span>
          <span id="quizScoreText">0 / ${questions.length}</span>
        </div>
      </div>
    </div>`;
  
  document.getElementById("chatMessages")?.appendChild(div);
  scrollBottom();
}

// ── Réponse quiz ─────────────────────────────────────────────
export function answerQuiz(qi, oi) {
  if (!quizData) return;
  
  const q = quizData[qi];
  const opts = document.querySelectorAll(`#qq-${qi} .quiz-opt`);
  
  opts.forEach(b => b.disabled = true);
  opts[q.reponseCorrecte]?.classList.add("correct");
  
  if (oi !== q.reponseCorrecte) {
    opts[oi]?.classList.add("wrong");
  }
  
  const expl = document.getElementById(`qe-${qi}`);
  if (expl) expl.style.display = "block";
  
  if (oi === q.reponseCorrecte) quizScore++;
  quizAnswered++;
  
  if (quizAnswered === quizData.length) {
    const bar = document.getElementById("quizScoreBar");
    const scoreText = document.getElementById("quizScoreText");
    if (bar && scoreText) {
      bar.style.display = "flex";
      scoreText.textContent = `${quizScore} / ${quizData.length} (${Math.round(quizScore/quizData.length*100)}%)`;
    }
  }
}

// ── Helpers UI ───────────────────────────────────────────────
function appendMsg(role, content) {
  const welcome = document.getElementById("chatWelcome");
  if (welcome) welcome.remove();

  const div = document.createElement("div");
  div.className = `msg ${role}`;
  
  // Utiliser formatContent pour le contenu IA, escapeHtml pour l'utilisateur
  const safeContent = role === "ai" ? formatContent(content) : escapeHtml(content);
  
  div.innerHTML = `
    <div class="msg-avatar">${role === "ai" ? '<i class="fas fa-graduation-cap"></i>' : '👤'}</div>
    <div class="msg-content">${safeContent}</div>`;
  
  document.getElementById("chatMessages")?.appendChild(div);
  scrollBottom();
}

function formatContent(text) {
  // D'abord échapper tout le HTML
  let safe = escapeHtml(text);
  
  // Puis appliquer le formatage Markdown de manière sécurisée
  safe = safe
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/```([\s\S]*?)```/g, "<pre>$1</pre>")
    .replace(/^### (.*)/gm, "<strong>$1</strong>")
    .replace(/^## (.*)/gm, "<strong>$1</strong>")
    .replace(/^# (.*)/gm, "<strong>$1</strong>")
    .replace(/^- (.*)/gm, "• $1")
    .replace(/\n/g, "<br>");
  
  return safe;
}

function appendTyping() {
  const id = "typing-" + Date.now();
  const div = document.createElement("div");
  div.className = "msg ai";
  div.id = id;
  div.innerHTML = `
    <div class="msg-avatar"><i class="fas fa-graduation-cap"></i></div>
    <div class="msg-content">
      <div class="typing"><span></span><span></span><span></span></div>
    </div>`;
  
  document.getElementById("chatMessages")?.appendChild(div);
  scrollBottom();
  return id;
}

function removeTyping(id) {
  document.getElementById(id)?.remove();
}

function scrollBottom() {
  const el = document.getElementById("chatMessages");
  if (el) el.scrollTop = el.scrollHeight;
}

function hideWelcome() {
  document.getElementById("chatWelcome")?.remove();
}

// ── Sessions ─────────────────────────────────────────────────
function saveSession(question, preview) {
  const session = {
    id: Date.now(),
    question: question.slice(0, 40),
    preview,
    messages: [...messages]
  };
  
  sessions.unshift(session);
  sessions = sessions.slice(0, 20);
  localStorage.setItem("campusly_chat_sessions", JSON.stringify(sessions));
  renderHistory();
}

function renderHistory() {
  const el = document.getElementById("chatHistory");
  if (!el) return;
  
  if (sessions.length === 0) {
    el.innerHTML = `<div style="font-size:0.78rem;color:var(--text-4);padding:8px 4px;">Aucune conversation</div>`;
    return;
  }
  
  el.innerHTML = sessions.slice(0, 15).map(s => {
    const safeQuestion = escapeHtml(s.question);
    return `
      <div class="chat-history-item" onclick="window.loadSession(${s.id})" title="${safeQuestion}">
        <i class="fas fa-comments"></i> ${safeQuestion}
      </div>`;
  }).join("");
}

export function loadSession(id) {
  const s = sessions.find(s => s.id === id);
  if (!s) return;
  
  messages = [...s.messages];
  const container = document.getElementById("chatMessages");
  if (!container) return;
  
  container.innerHTML = "";
  messages.forEach(m => appendMsg(m.role === "user" ? "user" : "ai", m.content));
}

export function newChat() {
  messages = [];
  const container = document.getElementById("chatMessages");
  if (!container) return;
  
  container.innerHTML = `
    <div class="chat-welcome" id="chatWelcome">
      <div class="chat-welcome-icon"><i class="fas fa-graduation-cap"></i></div>
      <h2>Assistant IA Campusly</h2>
      <p>Posez vos questions, générez des quiz de 50 questions, ou demandez des explications.</p>
      <div class="chat-suggestions">
        <div class="chat-suggestion" onclick="window.sendSuggestion('Génère 50 questions sur la Microéconomie')">📝 Quiz Microéconomie</div>
        <div class="chat-suggestion" onclick="window.sendSuggestion('Génère 50 questions sur le Droit Civil')">📝 Quiz Droit Civil</div>
        <div class="chat-suggestion" onclick="window.sendSuggestion('Génère 50 questions sur l\\'Anatomie')">📝 Quiz Anatomie</div>
        <div class="chat-suggestion" onclick="window.sendSuggestion('Explique-moi la loi de Hooke')">💡 Explication</div>
      </div>
    </div>`;
}

// Exposer les fonctions globalement pour les onclick
if (typeof window !== 'undefined') {
  window.setMode = setMode;
  window.sendMessage = sendMessage;
  window.sendSuggestion = sendSuggestion;
  window.answerQuiz = answerQuiz;
  window.loadSession = loadSession;
  window.newChat = newChat;
}
