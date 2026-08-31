// ============================================================
// CAMPUSLY 2.0 — userService.js
// Données et progression de l'utilisateur (Apprenant / Professeur)
// ============================================================

import { authService } from './authService.js';
import { INITIAL_USER, MOCK_TEACHER_PROFILE } from './mockData.js';

export const ACADEMIC_LEVELS = [
  { key: "new", name: "Nouveau", icon: '<i class="fa-solid fa-seedling" style="color:var(--success);"></i>', faIcon: "fa-solid fa-seedling", minXp: 0, maxXp: 100 },
  { key: "beginner", name: "Débutant", icon: '<i class="fa-solid fa-book-open" style="color:var(--brand-2);"></i>', faIcon: "fa-solid fa-book-open", minXp: 100, maxXp: 250 },
  { key: "apprentice", name: "Apprenti", icon: '<i class="fa-solid fa-graduation-cap" style="color:var(--brand-1);"></i>', faIcon: "fa-solid fa-graduation-cap", minXp: 250, maxXp: 500 },
  { key: "intermediate", name: "Intermédiaire", icon: '<i class="fa-solid fa-bolt" style="color:var(--accent);"></i>', faIcon: "fa-solid fa-bolt", minXp: 500, maxXp: 1000 },
  { key: "advanced", name: "Avancé", icon: '<i class="fa-solid fa-rocket" style="color:#8b5cf6;"></i>', faIcon: "fa-solid fa-rocket", minXp: 1000, maxXp: 2000 },
  { key: "expert", name: "Expert", icon: '<i class="fa-solid fa-crown" style="color:#eab308;"></i>', faIcon: "fa-solid fa-crown", minXp: 2000, maxXp: 99999 }
];

export class UserService {
  getUser() {
    return authService.getUser() || INITIAL_USER;
  }

  getLearnerDashboardData() {
    const user = this.getUser();
    return {
      welcomeTitle: `Bonjour ${user.prenom || 'Rosaire'}`,
      welcomeSub: "Voici où vous en êtes aujourd'hui.",
      weeklyGoal: user.weeklyGoal || { target: 4, current: 3, period: "Semaine en cours" },
      lastCourse: user.lastCourse || {
        title: "Algorithmique — Complexité",
        chapter: "Chapitre 3 : Notations Asymptotiques",
        progressPercent: 68
      },
      credits: user.credits ?? 120,
      streak: user.streak ?? 7,
      academicLevel: this.calculateLevel(user.academicLevel?.xp || 350),
      weakTopics: user.weakTopics || [
        { subject: "Analyse", mastery: 52, priority: "Haute" },
        { subject: "Probabilités", mastery: 43, priority: "Haute" },
        { subject: "Algorithmique", mastery: 61, priority: "Moyenne" }
      ],
      strongTopics: user.strongTopics || [
        { subject: "Bases de Données SQL", mastery: 93 },
        { subject: "Algèbre Linéaire", mastery: 88 }
      ],
      recentActivities: user.recentActivities || INITIAL_USER.recentActivities
    };
  }

  getTeacherDashboardData() {
    const user = this.getUser();
    return {
      welcomeTitle: `Bonjour ${user.prenom || 'Dr.'} ${user.nom || 'Mensah'}`,
      welcomeSub: "Centre de pilotage pédagogique UAC",
      stats: MOCK_TEACHER_PROFILE.stats,
      alerts: MOCK_TEACHER_PROFILE.alerts,
      classes: [
        { id: "cls-algo-l2", name: "L2 Informatique — Algorithmique", students: 68, avg: "14.2/20", activeDevoir: "Devoir #2" },
        { id: "cls-math-l2", name: "L2 Maths — Analyse Réelle", students: 112, avg: "11.8/20", activeDevoir: "Série TD 4" }
      ]
    };
  }

  calculateLevel(xp = 350) {
    let currentLevel = ACADEMIC_LEVELS[0];
    let nextLevel = ACADEMIC_LEVELS[1];

    for (let i = 0; i < ACADEMIC_LEVELS.length; i++) {
      if (xp >= ACADEMIC_LEVELS[i].minXp) {
        currentLevel = ACADEMIC_LEVELS[i];
        nextLevel = ACADEMIC_LEVELS[i + 1] || ACADEMIC_LEVELS[i];
      }
    }

    const range = (nextLevel.minXp - currentLevel.minXp) || 100;
    const currentProgress = xp - currentLevel.minXp;
    const progressPercent = Math.min(100, Math.round((currentProgress / range) * 100));

    return {
      ...currentLevel,
      xp,
      nextLevelName: nextLevel.name,
      nextThreshold: nextLevel.minXp,
      progressPercent
    };
  }

  addXp(amount) {
    const user = this.getUser();
    const currentXp = (user.academicLevel?.xp || 350) + amount;
    const newLevel = this.calculateLevel(currentXp);
    
    authService.updateProfile({
      academicLevel: newLevel
    });

    return newLevel;
  }

  recordQuizResult({ subject, score, total, topicBreakdown = [] }) {
    const user = this.getUser();
    const percent = Math.round((score / total) * 100);
    this.addXp(score * 15);

    // Mettre à jour les points faibles / forts
    let weakTopics = [...(user.weakTopics || [])];
    let strongTopics = [...(user.strongTopics || [])];

    if (percent < 60) {
      const idx = weakTopics.findIndex(t => t.subject === subject);
      if (idx >= 0) {
        weakTopics[idx].mastery = Math.round((weakTopics[idx].mastery + percent) / 2);
      } else {
        weakTopics.push({ subject, mastery: percent, priority: "Haute" });
      }
      strongTopics = strongTopics.filter(t => t.subject !== subject);
    } else if (percent >= 75) {
      const idx = strongTopics.findIndex(t => t.subject === subject);
      if (idx >= 0) {
        strongTopics[idx].mastery = Math.max(strongTopics[idx].mastery, percent);
      } else {
        strongTopics.push({ subject, mastery: percent });
      }
      weakTopics = weakTopics.filter(t => t.subject !== subject);
    }

    const newActivity = {
      id: "act_" + Date.now(),
      type: "quiz",
      title: `Quiz : ${subject}`,
      score: `${score}/${total}`,
      time: "À l'instant",
      icon: percent >= 60 ? "circle-check" : "circle-xmark",
      color: percent >= 60 ? "var(--success)" : "var(--danger)"
    };

    authService.updateProfile({
      weakTopics,
      strongTopics,
      recentActivities: [newActivity, ...(user.recentActivities || [])].slice(0, 8)
    });
  }
}

export const userService = new UserService();
window.userService = userService;
