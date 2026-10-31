'use client';
import React, { useState } from 'react';
import Logo from './Logo';

export default function Navbar({ currentView, navigateTo, activeRole, setRole, toggleTheme, userXp }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b bg-white/80 dark:bg-slate-950/85 border-slate-200 dark:border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div onClick={() => { navigateTo('landing'); setMobileMenuOpen(false); }}>
            <Logo />
          </div>

          <div className="hidden lg:flex items-center bg-slate-200/80 dark:bg-slate-900/90 p-1 rounded-2xl border border-slate-300/80 dark:border-white/10 shadow-inner">
            <button
              onClick={() => setRole('apprenant')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'apprenant'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-graduation-cap text-cyan-300"></i>
              <span>Espace Apprenant</span>
            </button>
            <button
              onClick={() => setRole('enseignant')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'enseignant'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-chalkboard-user text-emerald-500"></i>
              <span>Espace Enseignant</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-slate-200/60 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-300/80 dark:border-white/5 text-xs font-bold">
            {[
              { id: 'landing', label: 'Accueil' },
              { id: 'epreuves', label: 'Épreuves', icon: 'fa-book-bookmark text-indigo-500' },
              { id: 'quiz', label: 'Quiz & IA', icon: 'fa-wand-magic-sparkles text-sky-500' },
              { id: 'exam', label: 'Examen Blanc', icon: 'fa-stopwatch text-rose-500' },
              { id: 'classrooms', label: 'Classrooms', icon: 'fa-users-rectangle text-emerald-500' },
              { id: 'forum', label: 'Forum', icon: 'fa-comments text-amber-500' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  currentView === item.id
                    ? 'text-indigo-600 dark:text-white bg-white dark:bg-white/10 shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white'
                }`}
              >
                {item.icon && <i className={`fa-solid ${item.icon}`}></i>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-colors"
              title="Basculer Mode Clair / Sombre"
            >
              <i className="fa-solid fa-moon dark:hidden"></i>
              <i className="fa-solid fa-sun hidden dark:inline text-amber-400"></i>
            </button>

            <button
              onClick={() => navigateTo('dashboard')}
              className="hidden sm:flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-200/90 dark:bg-slate-900 border border-slate-300 dark:border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/30"
                alt="Avatar"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>Aurelien</span>
                  <span className="text-[10px] text-amber-500 font-extrabold flex items-center gap-0.5">
                    <i className="fa-solid fa-fire text-amber-500"></i> 14j
                  </span>
                </div>
                <div className="text-[10px] text-indigo-500 dark:text-indigo-300 font-mono">
                  {userXp.toLocaleString()} XP
                </div>
              </div>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-500 transition-colors"
              aria-label="Menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark text-rose-500' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>

        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl px-4 py-5 space-y-3 shadow-2xl max-h-[calc(100vh-85px)] overflow-y-auto">
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-900/90 p-1 rounded-2xl border border-slate-300/80 dark:border-white/10 mb-2">
            <button
              onClick={() => { setRole('apprenant'); setMobileMenuOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'apprenant'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <i className="fa-solid fa-graduation-cap text-cyan-300"></i>
              <span>Apprenant</span>
            </button>
            <button
              onClick={() => { setRole('enseignant'); setMobileMenuOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'enseignant'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <i className="fa-solid fa-chalkboard-user text-emerald-500"></i>
              <span>Enseignant</span>
            </button>
          </div>

          <div className="space-y-1">
            {[
              { id: 'landing', label: 'Accueil', icon: 'fa-house text-indigo-500' },
              { id: 'epreuves', label: "Banque d'Épreuves", icon: 'fa-book-bookmark text-indigo-500' },
              { id: 'quiz', label: 'Quiz & IA Vos Cours', icon: 'fa-wand-magic-sparkles text-sky-500' },
              { id: 'exam', label: 'Examen Blanc Surveillé', icon: 'fa-stopwatch text-rose-500' },
              { id: 'classrooms', label: 'Classrooms Virtuelles', icon: 'fa-users-rectangle text-emerald-500' },
              { id: 'forum', label: 'Forum Entraide', icon: 'fa-comments text-amber-500' },
              { id: 'dashboard', label: 'Mon Profil & Recharges', icon: 'fa-user-graduate text-indigo-500' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { navigateTo(item.id); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-colors ${
                  currentView === item.id
                    ? 'text-indigo-600 dark:text-white bg-white dark:bg-white/10 shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <i className={`fa-solid ${item.icon} w-4 text-center`}></i>
                  <span>{item.label}</span>
                </span>
                <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
