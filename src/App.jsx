import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import EpreuvesPage from './pages/EpreuvesPage';
import AIQuizPage from './pages/AIQuizPage';
import DashboardPage from './pages/DashboardPage';
import { MOCK_USER } from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [activeRole, setActiveRole] = useState('apprenant'); // 'apprenant' or 'enseignant'
  const [user, setUser] = useState(MOCK_USER);
  const [quizTopic, setQuizTopic] = useState('');

  const handleAddXp = (amount) => {
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + amount
    }));
  };

  const handleStartQuizFromEpreuve = (epreuve) => {
    setQuizTopic(epreuve.title);
    setCurrentView('ai-quiz');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* High-end bespoke Navigation */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage 
            setCurrentView={setCurrentView} 
            setSelectedFaculty={setSelectedFaculty}
            activeRole={activeRole}
            setActiveRole={setActiveRole}
          />
        )}

        {currentView === 'epreuves' && (
          <EpreuvesPage 
            selectedFaculty={selectedFaculty} 
            setSelectedFaculty={setSelectedFaculty} 
            onStartQuizFromEpreuve={handleStartQuizFromEpreuve}
          />
        )}

        {currentView === 'ai-quiz' && (
          <AIQuizPage 
            user={user} 
            onAddXp={handleAddXp} 
            customTopic={quizTopic} 
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage 
            user={user} 
            setCurrentView={setCurrentView} 
            setSelectedFaculty={setSelectedFaculty}
            activeRole={activeRole}
          />
        )}
      </main>

      {/* Editorial Academic Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-12 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-extrabold text-white text-sm">Campusly • Écosystème Éducatif UAC</span>
            <p className="text-[11px] text-slate-500">
              Inspiré des plus hauts standards pédagogiques. Conçu pour le Bénin et l'Afrique francophone.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold">
            <button onClick={() => setCurrentView('epreuves')} className="hover:text-white transition-colors">Banque d'Épreuves</button>
            <button onClick={() => setCurrentView('ai-quiz')} className="hover:text-white transition-colors">Quiz IA</button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition-colors">Classrooms</button>
            <a href="https://wa.me/2290158519556" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300">
              Support WhatsApp (+229)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
