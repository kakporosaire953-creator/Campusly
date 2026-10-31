'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import confetti from 'canvas-confetti';

export default function CampuslyApp() {
  const [currentView, setCurrentView] = useState('landing');
  const [activeRole, setActiveRole] = useState('apprenant');
  const [userXp, setUserXp] = useState(3450);
  const [userCredits, setUserCredits] = useState(42);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFac, setSelectedFac] = useState('all');
  const [toastMsg, setToastMsg] = useState('');

  // Modals
  const [previewModal, setPreviewModal] = useState(null);
  const [joinClassOpen, setJoinClassOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [joinClassInput, setJoinClassInput] = useState('');

  // Quiz State
  const [quizTopic, setQuizTopic] = useState('Algorithmique & Arbres AVL');
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizMode, setQuizMode] = useState('interactive'); // 'interactive' or 'upload'

  // Exam state
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examTime, setExamTime] = useState('44:18');

  // AI Chat
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Bonjour ! Posez-moi vos questions sur le programme de révision ou chargez un cours pour concevoir un QCM personnalisé.' }
  ]);

  // Forum
  const [forumPosts, setForumPosts] = useState([
    {
      id: 1,
      author: 'Awa Dossou',
      fac: 'FAST • Informatique',
      time: 'Il y a 2h',
      title: 'Compréhension des rotations simples vs doubles dans les arbres AVL ?',
      content: "Quelqu'un aurait un schéma simple pour distinguer le cas Gauche-Droite (GD) lors de l'insertion dans un arbre AVL pour l'examen de demain ?",
      likes: 14,
      replies: 6
    },
    {
      id: 2,
      author: 'Koffi Mensah',
      fac: 'FASEG • Économie',
      time: 'Hier',
      title: 'Corrigé type de la session 2024 de Microéconomie II disponible !',
      content: "J'ai uploadé la résolution détaillée de la partie sur l'équilibre concurrentiel Walrasien dans la banque d'épreuves.",
      likes: 28,
      replies: 12
    }
  ]);

  const quizQuestions = [
    {
      q: "Dans un arbre binaire de recherche auto-équilibrant de type AVL, quelle est la différence de hauteur maximale tolérée entre les sous-arbres gauche et droit de chaque nœud ?",
      opts: ["0 (hauteurs strictement identiques)", "1 (facteur d'équilibre égal à -1, 0 ou +1)", "2 (avec rééquilibrage différé)"],
      correct: 1,
      exp: "Un arbre AVL est caractérisé par un facteur d'équilibre de -1, 0 ou +1 pour chaque nœud, garantissant un coût logarithmique O(log n)."
    },
    {
      q: "En droit civil béninois/OHADA, quels sont les trois critères cumulatifs pour engager la responsabilité délictuelle ?",
      opts: ["Une faute, un dommage certain et un lien de causalité direct", "Un contrat écrit et un défaut de paiement", "Un aveu judiciaire certifié par huissier"],
      correct: 0,
      exp: "La responsabilité délictuelle exige invariablement la réunion d'une faute, d'un préjudice direct et certain, et d'un lien de causalité incontestable."
    },
    {
      q: "Quelle est la complexité asymptotique pire-cas du tri rapide (Quicksort) sans pivot aléatoire ?",
      opts: ["O(n log n)", "O(n²)", "O(2ⁿ)"],
      correct: 1,
      exp: "Si le pivot choisi est systématiquement le premier ou dernier élément d'un tableau déjà ordonné, la partition dégénère en O(n²)."
    }
  ];

  const epreuvesData = [
    {
      id: 1,
      fac: 'FAST',
      code: 'INF-201',
      title: 'Algorithmique & Structures de Données Avancées',
      year: '2024-2025',
      session: 'Normale • S3',
      dept: 'Département Informatique',
      extract: 'Exercice 1: Analyse asymptotique des algorithmes de parcours. Exercice 2: Équilibrage dynamique des arbres AVL. Problème: Graphe orienté pondéré et algorithme de Dijkstra appliqué au réseau de transport de Cotonou.'
    },
    {
      id: 2,
      fac: 'FASEG',
      code: 'ECO-102',
      title: 'Microéconomie II — Équilibre Général & Bien-Être',
      year: '2024-2025',
      session: 'Rattrapage • S2',
      dept: 'Sciences Économiques',
      extract: "Partie 1: Dans une économie d'échange pur à deux agents munis de fonctions d'utilité Cobb-Douglas. Déterminer la boîte d'Edgeworth et le vecteur de prix d'équilibre walrasien."
    },
    {
      id: 3,
      fac: 'FADESP',
      code: 'DRT-204',
      title: 'Droit des Obligations & Responsabilité Civile',
      year: '2023-2024',
      session: 'Normale • S4',
      dept: 'Droit Privé',
      extract: "Cas pratique: Un commerçant de Dantokpa s'engage par lettre d'intention avant de rompre brutalement les négociations contractuelles. Qualifier la nature du préjudice indemnisable."
    }
  ];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  const handleQuizAnswer = (idx) => {
    if (quizAnswered) return;
    setQuizAnswered(true);
    setSelectedOption(idx);
    if (idx === quizQuestions[quizIdx].correct) {
      setUserXp(prev => prev + 50);
      try { confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } }); } catch (e) {}
    }
  };

  const nextQuestion = () => {
    setQuizIdx((prev) => (prev + 1) % quizQuestions.length);
    setQuizAnswered(false);
    setSelectedOption(null);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Analyse académique Campusly : Sur le concept "${msg}", assurez-vous de maîtriser les 3 axiomes de base ainsi que les cas d'application semestriels de l'UAC. Souhaitez-vous générer un quiz d'entraînement dessus ?`
        }
      ]);
    }, 600);
  };

  const filteredEpreuves = epreuvesData.filter((ep) => {
    const matchesFac = selectedFac === 'all' || ep.fac === selectedFac;
    const matchesSearch = ep.title.toLowerCase().includes(searchTerm.toLowerCase()) || ep.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFac && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentView={currentView}
        navigateTo={setCurrentView}
        activeRole={activeRole}
        setRole={setActiveRole}
        toggleTheme={toggleTheme}
        userXp={userXp}
      />

      <main className="flex-1 pt-24">
        {/* VIEW 1: LANDING */}
        {currentView === 'landing' && (
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
            <div className="text-center max-w-4xl mx-auto pt-6 pb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-300 text-xs font-bold tracking-wide backdrop-blur-md mb-6 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Plateforme Éducative & Évaluations UAC — Session Académique 2025/2026</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12] text-slate-900 dark:text-white">
                Apprenez mieux. Enseignez plus vite. <br />
                <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                  Avec l'IA et vos propres documents.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed">
                Campusly transforme vos épreuves d’examen, PDF de cours et notes de TD en quiz interactifs et compositions surveillées. Conçu spécifiquement pour l’Université d’Abomey-Calavi.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => { setActiveRole('apprenant'); setCurrentView('epreuves'); }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                >
                  <div className="text-left">
                    <div className="text-xs text-indigo-200 font-semibold">Je suis apprenant</div>
                    <div className="text-sm font-extrabold">Commencer mes Révisions</div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-base ml-2"></i>
                </button>

                <button
                  onClick={() => { setActiveRole('enseignant'); setCurrentView('classrooms'); }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white font-extrabold text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg"
                >
                  <div className="text-left">
                    <div className="text-xs text-emerald-500 font-semibold">Vous êtes enseignant ?</div>
                    <div className="text-sm font-extrabold">Espace Classrooms & Compositions</div>
                  </div>
                  <i className="fa-solid fa-shield-halved text-base text-emerald-500 ml-2"></i>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-2"><i className="fa-solid fa-circle-check text-emerald-500"></i> Inscription gratuite</span>
                <span className="flex items-center gap-2"><i className="fa-solid fa-mobile-screen text-amber-500"></i> Mobile Money via FedaPay</span>
                <span className="flex items-center gap-2"><i className="fa-solid fa-lock text-sky-500"></i> Documents 100% privés</span>
              </div>
            </div>

            {/* Quick Search */}
            <div className="max-w-4xl mx-auto card-editorial p-4 sm:p-6 rounded-3xl mb-16">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setCurrentView('epreuves'); }}
                    placeholder="Rechercher une épreuve officielle (ex: Algorithme, Droit, Microéconomie)..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setCurrentView('epreuves')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Rechercher</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>

            {/* Dual Role Feature Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              <div className={`card-editorial p-8 rounded-3xl border transition-all ${activeRole === 'apprenant' ? 'border-indigo-500/50 bg-slate-100/80 dark:bg-slate-900/80 ring-2 ring-indigo-500/20' : 'border-slate-300 dark:border-white/10'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-xl">
                    <i className="fa-solid fa-user-graduate"></i>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Parcours Apprenant</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tout pour réussir vos examens à votre rythme</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">Accédez aux annales complètes de vos filières, composez en ligne et consolidez vos points faibles avec le tuteur IA.</p>
                <ul className="space-y-3 mb-8 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2.5"><i className="fa-solid fa-circle-check text-emerald-500"></i> 500+ épreuves classées par faculté (S1 à S6)</li>
                  <li className="flex items-center gap-2.5"><i className="fa-solid fa-circle-check text-emerald-500"></i> Générateur de quiz IA sur vos propres polycopiés</li>
                  <li className="flex items-center gap-2.5"><i className="fa-solid fa-circle-check text-emerald-500"></i> Compositions surveillées à distance sans déplacement</li>
                </ul>
                <button onClick={() => setCurrentView('epreuves')} className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer">
                  Explorer les Épreuves →
                </button>
              </div>

              <div className={`card-editorial p-8 rounded-3xl border transition-all ${activeRole === 'enseignant' ? 'border-emerald-500/50 bg-slate-100/80 dark:bg-slate-900/80 ring-2 ring-emerald-500/20' : 'border-slate-300 dark:border-white/10'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl">
                    <i className="fa-solid fa-chalkboard-user"></i>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Parcours Enseignant</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Gérez vos Classrooms et évaluez sans stress</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">Créez des QCM en 30 secondes à partir de vos cours et évaluez vos étudiants avec surveillance anti-triche intégrée.</p>
                <ul className="space-y-3 mb-8 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2.5"><i className="fa-solid fa-circle-check text-emerald-500"></i> Code d'invitation simple pour vos étudiants</li>
                  <li className="flex items-center gap-2.5"><i className="fa-solid fa-circle-check text-emerald-500"></i> Génération automatique de barèmes avec l'IA</li>
                  <li className="flex items-center gap-2.5"><i className="fa-solid fa-circle-check text-emerald-500"></i> Export des notes et statistiques des notions non acquises</li>
                </ul>
                <button onClick={() => setCurrentView('classrooms')} className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 cursor-pointer">
                  Espace Enseignant & Classes →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: EPREUVES */}
        {currentView === 'epreuves' && (
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full">Annales UAC Officielles</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">Banque Numérique d'Épreuves</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sujets originaux d'examen avec prévisualisation et corrigés types vérifiés.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'FAST', 'FASEG', 'FADESP', 'EPAC', 'ENEAM', 'FSS'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFac(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedFac === f
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    {f === 'all' ? 'Tous' : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredEpreuves.map((ep) => (
                <div key={ep.id} className="card-editorial p-6 rounded-3xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                        {ep.fac} • {ep.session}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <i className="fa-solid fa-circle-check"></i> Corrigé
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{ep.title}</h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">{ep.code} — {ep.dept}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 italic bg-slate-100 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-white/5 line-clamp-3">
                      "{ep.extract}"
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewModal(ep)}
                      className="py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-500 text-xs font-bold cursor-pointer"
                    >
                      <i className="fa-solid fa-eye mr-1"></i> Aperçu
                    </button>
                    <button
                      onClick={() => { setQuizTopic(ep.title); setCurrentView('quiz'); }}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold border border-indigo-500/30 text-center cursor-pointer"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles mr-1 text-cyan-400"></i> Quiz IA
                    </button>
                    <button
                      onClick={() => showToast(`Téléchargement de ${ep.code} en cours...`)}
                      className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
                    >
                      <i className="fa-solid fa-download"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: QUIZ & STUDIO IA */}
        {currentView === 'quiz' && (
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full">Tuteur Cognitif Adaptatif</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">Studio de Quiz & Générateur IA</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Transformez vos fichiers PDF de cours en évaluations interactives conformes au LMD.</p>

              <div className="inline-flex items-center bg-slate-200/80 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-300/80 dark:border-white/10 mt-6 shadow-md">
                <button
                  onClick={() => setQuizMode('interactive')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${quizMode === 'interactive' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Mode Marathon Quiz
                </button>
                <button
                  onClick={() => setQuizMode('upload')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${quizMode === 'upload' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  <i className="fa-solid fa-file-pdf text-rose-500"></i>
                  <span>Générer d'après un PDF (Quizos AI)</span>
                </button>
              </div>
            </div>

            {quizMode === 'interactive' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 card-editorial p-6 sm:p-8 rounded-3xl">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Mode Quiz : {quizTopic}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-500">Question {quizIdx + 1} / {quizQuestions.length}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
                    {quizQuestions[quizIdx].q}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {quizQuestions[quizIdx].opts.map((opt, i) => {
                      let btnCls = "quiz-opt w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-slate-900/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between";
                      if (quizAnswered) {
                        if (i === quizQuestions[quizIdx].correct) {
                          btnCls = "quiz-opt w-full text-left p-4 rounded-2xl border border-emerald-500 bg-emerald-100 dark:bg-emerald-950/70 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between";
                        } else if (i === selectedOption) {
                          btnCls = "quiz-opt w-full text-left p-4 rounded-2xl border border-rose-500 bg-rose-100 dark:bg-rose-950/70 text-xs sm:text-sm text-rose-800 dark:text-rose-200 flex items-center justify-between";
                        } else {
                          btnCls = "quiz-opt w-full text-left p-4 rounded-2xl border border-transparent bg-slate-100 dark:bg-slate-900/40 text-xs sm:text-sm text-slate-400 opacity-60 flex items-center justify-between";
                        }
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handleQuizAnswer(i)}
                          disabled={quizAnswered}
                          className={btnCls}
                        >
                          <span>{opt}</span>
                          <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-xs">
                            {String.fromCharCode(65 + i)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered && (
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/40 mb-6 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                      <strong className="text-indigo-600 dark:text-indigo-300 block mb-1">Explication de l'enseignant :</strong>
                      <span>{quizQuestions[quizIdx].exp}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">+50 XP attribués par réponse exacte</span>
                    {quizAnswered && (
                      <button onClick={nextQuestion} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer">
                        Question suivante →
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Assistant Sidebar */}
                <div className="lg:col-span-5 card-editorial p-6 rounded-3xl flex flex-col h-[520px]">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
                        <i className="fa-solid fa-sparkles"></i>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Campusly AI • Tuteur UAC</h4>
                        <p className="text-[10px] text-emerald-500 font-medium">Groq LLaMA-3 70B Versatile</p>
                      </div>
                    </div>
                    <button onClick={() => setQuizMode('upload')} className="px-2.5 py-1 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold border border-sky-500/20 cursor-pointer">
                      <i className="fa-solid fa-upload mr-1"></i> Charger PDF
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 py-4 text-xs pr-1">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`p-3.5 rounded-2xl text-xs max-w-[85%] ${msg.role === 'user' ? 'bg-indigo-600 text-white ml-auto text-right' : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'}`}>
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleChatSubmit} className="pt-3 border-t border-slate-200 dark:border-white/10 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Poser une question académique..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <button type="submit" className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer">
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* PDF GENERATOR VIEW */
              <div className="max-w-3xl mx-auto card-editorial p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-500 flex items-center justify-center text-xl">
                    <i className="fa-solid fa-file-arrow-up"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Générateur Automatique de Quiz depuis vos PDF</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Importez votre polycopié de cours ou vos notes de travaux dirigés.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-8 text-center bg-slate-50 dark:bg-slate-950 cursor-pointer relative transition-all">
                    <i className="fa-solid fa-cloud-arrow-up text-4xl text-slate-400 mb-3"></i>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Glissez votre cours PDF ici ou cliquez pour parcourir</div>
                    <p className="text-xs text-slate-500 mt-1">PDF de cours, TD ou polycopié (max 15 Mo)</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Nombre de questions</label>
                      <select className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white">
                        <option>5 questions (Express • 1 crédit IA)</option>
                        <option>10 questions (Standard • 2 crédits IA)</option>
                        <option>20 questions (Examen Blanc complet • 3 crédits IA)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Difficulté du barème</label>
                      <select className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white">
                        <option>Fondamentaux & Définitions</option>
                        <option>Standard Examen UAC (Recommandé)</option>
                        <option>Cas Pratiques & Synthèse Avancée</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast("Extraction cognitive du cours et génération des QCM réussie !");
                      setQuizMode('interactive');
                      setQuizTopic('Polycopié Cours UAC');
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Générer le Quiz avec l'IA</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: EXAMEN BLANC */}
        {currentView === 'exam' && (
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider bg-rose-500/10 px-3 py-1 rounded-full">Conditions Réelles UAC</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">Salle d'Examen Blanc Surveillé</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Évaluation chronométrée avec surveillance anti-triche et note officielle sur 20.</p>
              </div>
              {examStarted && !examSubmitted && (
                <div className="px-4 py-2 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 text-sm font-mono font-bold flex items-center gap-2 animate-pulse">
                  <i className="fa-solid fa-clock"></i>
                  <span>{examTime}</span>
                </div>
              )}
            </div>

            {!examStarted ? (
              <div className="card-editorial p-8 rounded-3xl max-w-3xl mx-auto text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-500 flex items-center justify-center text-2xl mx-auto">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Composition Blanche : Algorithmique & Graphes</h3>
                <p className="text-xs text-slate-500 max-w-lg mx-auto">
                  Durée : <strong>45 minutes</strong> • 5 questions • Barème : <strong>20 points</strong>. <br />
                  Le système détectera tout changement d'onglet ou sortie de plein écran.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs">
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5">
                    <i className="fa-solid fa-expand text-indigo-500 mb-1 block"></i>
                    <strong className="text-slate-900 dark:text-white">Plein Écran Forcé</strong>
                    <p className="text-slate-500 text-[11px] mt-0.5">La session s'annule si vous quittez la fenêtre.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5">
                    <i className="fa-solid fa-camera text-sky-500 mb-1 block"></i>
                    <strong className="text-slate-900 dark:text-white">Surveillance Proctoring</strong>
                    <p className="text-slate-500 text-[11px] mt-0.5">Vérification de présence et intégrité.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5">
                    <i className="fa-solid fa-trophy text-emerald-500 mb-1 block"></i>
                    <strong className="text-slate-900 dark:text-white">Note Immédiate</strong>
                    <p className="text-slate-500 text-[11px] mt-0.5">Calcul du résultat et corrigé détaillé.</p>
                  </div>
                </div>

                <button
                  onClick={() => setExamStarted(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-black text-sm shadow-xl hover:opacity-95 transition-all cursor-pointer"
                >
                  Démarrer l'Épreuve Surveillée Maintenant
                </button>
              </div>
            ) : !examSubmitted ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 card-editorial p-8 rounded-3xl">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-white/10">
                    <span className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                      Enregistrement Surveillé Actif
                    </span>
                    <span className="text-xs font-mono text-slate-500">Question 1 / 3</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
                    Quelle est la complexité asymptotique temporelle pire cas de la recherche dans un arbre binaire non équilibré à n nœuds ?
                  </h3>

                  <div className="space-y-3 mb-8">
                    {["O(1)", "O(log n)", "O(n)"].map((opt, idx) => (
                      <label key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-slate-950 flex items-center justify-between cursor-pointer hover:border-indigo-500">
                        <div className="flex items-center gap-3">
                          <input type="radio" name="exam_opt" className="accent-indigo-600" />
                          <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">{opt}</span>
                        </div>
                        <span className="font-mono text-xs text-slate-500">4 pts</span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setExamSubmitted(true);
                      try { confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } }); } catch (e) {}
                    }}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg cursor-pointer"
                  >
                    Terminer & Soumettre ma Copie
                  </button>
                </div>

                <div className="lg:col-span-4 card-editorial p-6 rounded-3xl space-y-4">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Flux Webcam Simulation</span>
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Conforme
                    </span>
                  </div>
                  <div className="aspect-video rounded-2xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden">
                    <i className="fa-solid fa-user text-4xl text-slate-700"></i>
                    <span className="text-[10px] text-slate-500 mt-2 font-mono">ID: Matricule 2023-04921</span>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold font-mono">REC</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-editorial p-8 rounded-3xl max-w-xl mx-auto text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-3xl mx-auto">
                  <i className="fa-solid fa-award"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Copie Corrigée & Validée !</h3>
                <div className="text-4xl font-black text-emerald-500 font-mono">16.0 / 20</div>
                <p className="text-xs text-slate-500">Mention Très Bien • Votre note a été enregistrée dans la classroom officielle.</p>
                <button onClick={() => setCurrentView('dashboard')} className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-lg cursor-pointer">
                  Voir mon Tableau de Bord →
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: CLASSROOMS */}
        {currentView === 'classrooms' && (
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full">Salles de Cours Virtuelles</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">Classrooms & Compositions</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Rejoignez une classe avec son code ou administrez vos promotions.</p>
              </div>
              <button
                onClick={() => setJoinClassOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Rejoindre avec un Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { fac: 'FAST • Licence 2', title: 'Algorithmique & Structures de Données', prof: 'Dr. K. AGBOTON — Université d’Abomey-Calavi', code: 'UAC-INFO-2026', students: 142, quizzes: 3, avg: '15.2/20' },
                { fac: 'FASEG • Licence 2', title: 'Microéconomie II — Équilibre Général', prof: 'Pr. M. HOUNGBEDJI — UAC', code: 'UAC-ECO-2026', students: 198, quizzes: 2, avg: '12.8/20' }
              ].map((cls, idx) => (
                <div key={idx} className="card-editorial p-6 rounded-3xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">{cls.fac}</span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{cls.title}</h3>
                      <p className="text-xs text-slate-500">{cls.prof}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                      {cls.code}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200 dark:border-white/5 text-center text-xs">
                    <div><div className="text-slate-500 text-[10px]">Étudiants</div><div className="font-bold text-slate-900 dark:text-white mt-0.5">{cls.students}</div></div>
                    <div><div className="text-slate-500 text-[10px]">Quiz Actifs</div><div className="font-bold text-cyan-500 mt-0.5">{cls.quizzes}</div></div>
                    <div><div className="text-slate-500 text-[10px]">Moyenne Promo</div><div className="font-bold text-emerald-500 mt-0.5">{cls.avg}</div></div>
                  </div>
                  <button onClick={() => setCurrentView('exam')} className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-colors cursor-pointer">
                    Lancer la Composition Surveillée
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: FORUM */}
        {currentView === 'forum' && (
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full">Entraide & Questions</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">Forum Étudiant UAC</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Posez vos questions sur les exercices et partagez vos fiches de révision.</p>
              </div>
              <button
                onClick={() => {
                  const t = prompt("Titre de votre question :");
                  if (t) {
                    setForumPosts(prev => [{ id: Date.now(), author: 'Aurelien KOUASSI', fac: 'UAC • Général', time: "À l'instant", title: t, content: 'Question publiée par un étudiant sur le forum.', likes: 0, replies: 0 }, ...prev]);
                    showToast("Votre question a été publiée !");
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Créer un Sujet</span>
              </button>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {forumPosts.map((post) => (
                <div key={post.id} className="card-editorial p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-500">{post.fac}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{post.author}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{post.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{post.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{post.content}</p>
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center gap-4 text-xs text-slate-500">
                    <button
                      onClick={() => {
                        setForumPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
                        showToast("+1 Like ajouté !");
                      }}
                      className="hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
                    >
                      <i className="fa-regular fa-thumbs-up"></i> <span>{post.likes}</span> likes
                    </button>
                    <button onClick={() => showToast("Section réponses ouverte")} className="hover:text-indigo-500 flex items-center gap-1 cursor-pointer">
                      <i className="fa-regular fa-comment"></i> {post.replies} réponses
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 7: DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10">
            <div className="card-editorial p-8 rounded-3xl mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30" alt="Avatar" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Aurelien KOUASSI</h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">Étudiant Vérifié</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Matricule : 2023-04921 • FAST (Informatique) — Licence 2</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Niveau</div>
                    <div className="text-lg font-black text-indigo-500">7</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Streak</div>
                    <div className="text-lg font-black text-amber-500">14j</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Crédits IA</div>
                    <div className="text-lg font-black text-cyan-500">{userCredits}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Progression vers le Niveau 8</span>
                  <span className="font-mono text-indigo-500 font-bold">{userXp.toLocaleString()} / 5,000 XP (70%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl relative overflow-hidden mb-8">
              <div className="text-xs font-bold tracking-wider uppercase text-cyan-300 mb-1">Pass Étudiant FedaPay</div>
              <h3 className="text-xl font-black mb-2">Abonnement Révision & Crédits IA</h3>
              <p className="text-xs text-slate-300 max-w-xl mb-4">Débloquez tous les corrigés d'examen et générez des QCM illimités sur vos propres cours via MTN Mobile Money ou Moov Money.</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black">1 500</span>
                <span className="text-xs text-indigo-300">FCFA / mois</span>
              </div>
              <button
                onClick={() => setPaymentOpen(true)}
                className="px-6 py-3 rounded-2xl bg-white text-indigo-950 font-black text-xs hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-mobile-screen"></i>
                <span>Recharger par Mobile Money (MTN & Moov)</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 py-12 px-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">Campusly • Écosystème Éducatif UAC</span>
            <p className="text-[11px] text-slate-500">Conçu pour le Bénin et l'Afrique francophone. Développé en React, Next.js & Tailwind CSS.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold">
            {['epreuves', 'quiz', 'exam', 'classrooms', 'forum'].map((v) => (
              <button key={v} onClick={() => setCurrentView(v)} className="hover:text-indigo-500 capitalize cursor-pointer">
                {v}
              </button>
            ))}
            <a href="https://wa.me/2290158519556" target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline">
              Support WhatsApp (+229)
            </a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="card-editorial w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/15 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-500">{previewModal.fac} • {previewModal.year}</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">{previewModal.title}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{previewModal.code}</p>
              </div>
              <button onClick={() => setPreviewModal(null)} className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 space-y-3 font-serif">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-sans flex items-center gap-2">
                <i className="fa-solid fa-file-lines text-indigo-500"></i> Extrait du Sujet Officiel
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">{previewModal.extract}</p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button onClick={() => setPreviewModal(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-white cursor-pointer">Fermer</button>
              <button
                onClick={() => {
                  setQuizTopic(previewModal.title);
                  setPreviewModal(null);
                  setCurrentView('quiz');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-cyan-300"></i>
                <span>Lancer le Quiz IA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {joinClassOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="card-editorial w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/15 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><i className="fa-solid fa-users-rectangle"></i></div>
                <div><h3 className="text-base font-bold text-slate-900 dark:text-white">Rejoindre une Classroom</h3><p className="text-xs text-slate-500">Code fourni par votre professeur</p></div>
              </div>
              <button onClick={() => setJoinClassOpen(false)} className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-white cursor-pointer"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <input
              type="text"
              value={joinClassInput}
              onChange={(e) => setJoinClassInput(e.target.value)}
              placeholder="Ex: UAC-INFO-2026"
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => {
                if (!joinClassInput) return;
                setJoinClassOpen(false);
                showToast(`Félicitations ! Vous avez rejoint la classroom ${joinClassInput}`);
                setJoinClassInput('');
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              Valider et Accéder au Cours
            </button>
          </div>
        </div>
      )}

      {paymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="card-editorial w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/15 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center"><i className="fa-solid fa-mobile-screen"></i></div>
                <div><h3 className="text-base font-bold text-slate-900 dark:text-white">Recharge FedaPay Mobile Money</h3><p className="text-xs text-slate-500">Paiement instantané en FCFA</p></div>
              </div>
              <button onClick={() => setPaymentOpen(false)} className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-white cursor-pointer"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Numéro de téléphone (MTN ou Moov)</label>
              <input type="tel" placeholder="+229 97 00 00 00" className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs" />
              <div className="flex gap-2">
                <button type="button" className="flex-1 py-2 rounded-xl bg-amber-500/20 text-amber-600 font-bold text-xs border border-amber-500/40">MTN Mobile Money</button>
                <button type="button" className="flex-1 py-2 rounded-xl bg-sky-500/20 text-sky-600 font-bold text-xs border border-sky-500/40">Moov Money</button>
              </div>
            </div>
            <button
              onClick={() => {
                setPaymentOpen(false);
                setUserCredits(prev => prev + 50);
                showToast("Paiement validé via FedaPay (+50 crédits IA activés) !");
                try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-black text-xs shadow-lg cursor-pointer"
            >
              Confirmer le Paiement (1 500 FCFA)
            </button>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-white/20 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 toast-animate">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
