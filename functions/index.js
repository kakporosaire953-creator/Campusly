// ============================================================
// CAMPUSLY — Firebase Cloud Functions
// ============================================================
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp }                 = require("firebase-admin/app");
const { getFirestore, Timestamp }       = require("firebase-admin/firestore");
const OpenAI                            = require("openai");

initializeApp();
const db = getFirestore();

// ============================================================
// CLOUD FUNCTION 1 : generateQuiz
// Callable — appelée depuis revision.js via httpsCallable()
// Proxy sécurisé vers OpenAI (la clé n'est jamais côté client)
// ============================================================
exports.generateQuiz = onCall(async (request) => {
  // 1. Vérifier l'authentification
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Vous devez être connecté pour générer un quiz.");
  }

  const uid    = request.auth.uid;
  const sujet  = request.data.sujet  || "";
  const faculte = request.data.faculte || "";
  const nbQ    = Math.min(Math.max(request.data.nbQuestions || 5, 5), 10);

  if (!sujet.trim()) {
    throw new HttpsError("invalid-argument", "Le sujet de révision est requis.");
  }

  // 2. Vérifier la limite quotidienne pour les non-premium
  const userRef  = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data() || {};

  const today       = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const resetDate   = userData.quizCountResetDate?.toDate?.()?.toISOString?.()?.slice(0, 10);
  const quizToday   = resetDate === today ? (userData.quizCountToday || 0) : 0;
  const isPremium   = userData.isPremium && userData.premiumExpiry?.toDate?.() > new Date();

  if (!isPremium && quizToday >= 3) {
    throw new HttpsError(
      "resource-exhausted",
      "Limite de 3 quiz gratuits atteinte aujourd'hui. Passez Premium pour un accès illimité."
    );
  }

  // 3. Appeler OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Tu es un assistant pédagogique pour des étudiants de l'Université d'Abomey-Calavi (Bénin).
Génère un quiz de ${nbQ} questions à choix multiples sur le sujet suivant : "${sujet}"${faculte ? ` (Faculté : ${faculte})` : ""}.

Réponds UNIQUEMENT avec un JSON valide respectant exactement cette structure :
{
  "questions": [
    {
      "question": "Texte de la question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "reponseCorrecte": 0,
      "explication": "Explication courte de la bonne réponse"
    }
  ]
}

Règles :
- Exactement ${nbQ} questions
- Exactement 4 options par question
- reponseCorrecte est l'index (0 à 3) de la bonne réponse
- Les questions doivent être adaptées au niveau universitaire
- Réponds en français`;

  let quizData;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    quizData = JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.error("Erreur OpenAI:", err);
    throw new HttpsError("internal", "Le service IA est temporairement indisponible. Réessayez.");
  }

  // 4. Valider la structure du quiz
  if (!quizData.questions || !Array.isArray(quizData.questions)) {
    throw new HttpsError("internal", "Réponse IA invalide. Réessayez.");
  }

  // 5. Mettre à jour le compteur de quiz
  await userRef.set({
    quizCountToday: quizToday + 1,
    quizCountResetDate: Timestamp.fromDate(new Date()),
  }, { merge: true });

  return { questions: quizData.questions };
});

// ============================================================
// CLOUD FUNCTION 3 : chatWithAI
// Callable — proxy sécurisé pour le chatbot (chatbot.html)
// ============================================================
exports.chatWithAI = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Vous devez être connecté.");
  }

  const { messages, mode } = request.data;

  if (!messages || !Array.isArray(messages)) {
    throw new HttpsError("invalid-argument", "Messages invalides.");
  }

  const systemPrompts = {
    quiz:    "Tu es un assistant pédagogique expert pour les étudiants de l'UAC au Bénin. Quand on te demande un quiz, génère EXACTEMENT 50 questions à choix multiples. Réponds UNIQUEMENT avec un JSON valide : {\"questions\":[{\"question\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"reponseCorrecte\":0,\"explication\":\"...\"}]}",
    explain: "Tu es un assistant pédagogique expert pour les étudiants de l'UAC au Bénin. Tu fournis des explications très détaillées avec des exemples concrets adaptés au contexte béninois.",
    chat:    "Tu es un assistant pédagogique expert pour les étudiants de l'UAC au Bénin. Tu es conversationnel, précis et encourageant.",
  };

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let completion;
  try {
    completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompts[mode] || systemPrompts.chat },
        ...messages.slice(-20),
      ],
      temperature: 0.7,
      max_tokens: mode === "quiz" ? 12000 : 2000,
    });
  } catch (err) {
    console.error("Erreur OpenAI chatbot:", err);
    throw new HttpsError("internal", "Le service IA est temporairement indisponible.");
  }

  return { content: completion.choices[0].message.content };
});
// HTTP — reçoit les webhooks de confirmation de paiement
// ============================================================
// ============================================================
// CLOUD FUNCTION 4 : generateSummary
// Callable — résumé IA d'un sujet après quiz
// ============================================================
exports.generateSummary = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Connectez-vous.");
  const { sujet, faculte } = request.data;
  if (!sujet) throw new HttpsError("invalid-argument", "Sujet requis.");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Tu es un assistant pédagogique pour les étudiants de l'UAC au Bénin.
Génère un résumé clair et structuré du sujet "${sujet}"${faculte ? ` (Faculté : ${faculte})` : ""}.
Couvre les points clés en 5-8 paragraphes courts, niveau universitaire, en français.
Réponds directement avec le résumé, sans introduction.`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6, max_tokens: 1500,
    });
    return { summary: completion.choices[0].message.content };
  } catch(err) {
    throw new HttpsError("internal", "Service IA indisponible.");
  }
});

// ============================================================
// CLOUD FUNCTION 5 : flutterwaveWebhook
// HTTP — reçoit les webhooks de confirmation de paiement Flutterwave
// URL à configurer dans le dashboard Flutterwave :
//   https://[region]-[project].cloudfunctions.net/flutterwaveWebhook
// ============================================================
// ============================================================
// CLOUD FUNCTION 7 : generateRevisionPlan
// Callable — génère un plan de révision semaine par semaine
// ============================================================
exports.generateRevisionPlan = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Connectez-vous.");
  const { matieres, startDate, hoursPerDay, faculte } = request.data;
  if (!matieres?.length) throw new HttpsError("invalid-argument", "Matières requises.");

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const matieresStr = matieres.map(m => `${m.nom} (examen le ${m.dateExamen})`).join(", ");
  const prompt = `Tu es un coach académique pour les étudiants de l'UAC au Bénin (faculté: ${faculte||"universitaire"}).
Crée un plan de révision structuré pour ces matières : ${matieresStr}.
Date de début : ${startDate}. Disponibilité : ${hoursPerDay}h par jour.

Réponds UNIQUEMENT avec ce JSON (tableau de semaines) :
[
  {
    "label": "Semaine du JJ/MM au JJ/MM",
    "days": [
      { "date": "YYYY-MM-DD", "tasks": "Réviser chapitre X de Matière Y (1h) · Faire exercices Z (1h)" }
    ]
  }
]
Règles :
- Couvre toutes les matières proportionnellement au temps restant avant chaque examen
- Inclure des jours de révision générale avant chaque examen
- Prévoir des jours de repos (dimanche = repos)
- Tâches concrètes et réalistes pour le niveau universitaire
- Maximum 4 semaines`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 3000,
    });
    const raw  = JSON.parse(completion.choices[0].message.content);
    const plan = Array.isArray(raw) ? raw : (raw.plan || raw.semaines || []);
    return { plan };
  } catch(err) {
    throw new HttpsError("internal", "Service IA indisponible.");
  }
});

// ============================================================
// CLOUD FUNCTION 6 : getDailyQuestion
// Callable — génère une question du jour selon la faculté
// ============================================================
exports.getDailyQuestion = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Connectez-vous.");
  const uid     = request.auth.uid;
  const faculte = request.data.faculte || "universitaire";
  const today   = new Date().toISOString().slice(0, 10);
  const userRef  = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data() || {};
  if (userData.dailyQuestion?.date === today) {
    return { question: userData.dailyQuestion };
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Tu es un assistant pédagogique pour les étudiants de l'UAC au Bénin.
Génère UNE seule question de cours pour un étudiant en ${faculte}.
Réponds UNIQUEMENT avec ce JSON :
{"question":"Texte","options":["A","B","C","D"],"reponseCorrecte":0,"explication":"Explication courte","matiere":"Nom matière"}`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });
    const q = JSON.parse(completion.choices[0].message.content);
    q.date = today;
    await userRef.set({ dailyQuestion: q }, { merge: true });
    return { question: q };
  } catch(err) {
    throw new HttpsError("internal", "Service IA indisponible.");
  }
});

exports.flutterwaveWebhook = onRequest(async (req, res) => {
  // 1. Vérifier la signature secrète Flutterwave
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature  = req.headers["verif-hash"];

  if (!secretHash || signature !== secretHash) {
    console.warn("Webhook Flutterwave : signature invalide");
    return res.status(401).json({ error: "Signature invalide" });
  }

  const payload = req.body;
  const txRef   = payload.txRef || payload.tx_ref || "";
  const flwRef  = payload.flwRef || payload.flw_ref || "";
  const amount  = payload.amount || 0;
  const status  = payload.status === "successful" ? "success" : "failed";
  const userId  = payload.meta?.userId || "";
  const days    = parseInt(payload.meta?.days || "30", 10);
  const plan    = payload.meta?.plan || "";

  // 2. Enregistrer la transaction
  await db.collection("transactions").add({
    txRef, flwRef, amount,
    currency: payload.currency || "XOF",
    status, userId, plan,
    createdAt: Timestamp.now(),
  });

  // 3. Si paiement réussi → activer le Premium
  if (status === "success" && userId) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    await db.collection("users").doc(userId).set({
      isPremium:     true,
      premiumExpiry: Timestamp.fromDate(expiry),
    }, { merge: true });
    console.log(`Premium activé pour ${userId} — ${days} jours`);
  }

  return res.status(200).json({ received: true });
});
