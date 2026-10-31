import React from 'react';

// Custom SVG Icons crafted specifically for Campusly (No generic icons)
export function IconDocumentAi({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 13H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 17H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      {/* AI Pulse dot */}
      <circle cx="16" cy="17" r="1.5" fill="#38bdf8" />
    </svg>
  );
}

export function IconClassroomPro({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6L12 2L21 6L12 10L3 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M7 11V16C7 16 9.5 18 12 18C14.5 18 17 16 17 16V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M21 10V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="14" r="1" fill="#818cf8"/>
    </svg>
  );
}

export function IconMobileMoney({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Wave / Signal curve representing MTN/Moov Mobile Money */}
      <path d="M9 8C10.5 7 13.5 7 15 8" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 11C10.5 9.5 13.5 9.5 16 11" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 14C10.5 13 13.5 13 15 14" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconProctoringSecurity({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="12" cy="11" r="3" stroke="#818cf8" strokeWidth="1.8"/>
      <path d="M12 10V11" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function IconAdaptiveStreak({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 17 6.5 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 8.5 9.5 5 12 2Z" fill="url(#streakFire)" />
      <path d="M12 12C12 12 14.5 14 14.5 16.5C14.5 17.8807 13.3807 19 12 19C10.6193 19 9.5 17.8807 9.5 16.5C9.5 14.5 11 13 12 12Z" fill="#fef08a" />
      <defs>
        <linearGradient id="streakFire" x1="12" y1="2" x2="12" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#ef4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}
