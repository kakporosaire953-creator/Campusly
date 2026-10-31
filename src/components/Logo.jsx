'use client';
import React from 'react';

export default function Logo({ size = 'md' }) {
  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      <div className="relative w-11 h-11 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 opacity-70 blur-[6px] group-hover:opacity-100 transition-opacity"></div>
        <div className="relative w-full h-full rounded-2xl bg-slate-950 border border-white/20 p-2 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <path d="M20 5 L35 13 L20 21 L5 13 Z" fill="url(#nextNavGradA)" />
            <path d="M20 22.5 L33 16 V27.5 C33 27.5 28 31 20 34 C12 31 7 27.5 7 27.5 V16 L20 22.5 Z" fill="url(#nextNavGradB)" opacity="0.85" />
            <circle cx="20" cy="13" r="2.2" fill="#ffffff" />
            <path d="M20 23 V34" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <defs>
              <linearGradient id="nextNavGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="nextNavGradB" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Campusly</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">UAC • AI</span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Plateforme Académique Intelligente</span>
      </div>
    </div>
  );
}
