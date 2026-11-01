// ============================================================
// CAMPUSLY — js/adaptive-engine.js
// Moteur d'apprentissage adaptatif, progression & streak
// ============================================================

export const ACADEMIC_LEVELS = [
  { name: 'Nouveau', minXp: 0, maxXp: 100, faIcon: 'fas fa-seedling', desc: 'Découverte de la plateforme' },
  { name: 'Débutant', minXp: 101, maxXp: 300, faIcon: 'fas fa-book-open', desc: 'Premières séries de révision' },
  { name: 'Apprenti', minXp: 301, maxXp: 700, faIcon: 'fas fa-graduation-cap', desc: 'Consolidation des fondamentaux' },
  { name: 'Intermédiaire', minXp: 701, maxXp: 1500, faIcon: 'fas fa-bolt', desc: 'Maîtrise des concepts académiques' },
  { name: 'Avancé', minXp: 1501, maxXp: 3000, faIcon: 'fas fa-trophy', desc: 'Excellence et résolution méthodique' },
  { name: 'Expert', minXp: 3001, maxXp: 999999, faIcon: 'fas fa-crown', desc: 'Maîtrise totale des épreuves & syllabus' }
];

export class AdaptiveEngine {
  constructor() {
    this.storageKey = 'campusly_adaptive_profile';
    this.data = this.load();
  }

  load() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return {
      xp: 350,
      streak: 7,
      bestStreak: 14,
      lastActiveDate: new Date().toISOString().split('T')[0],
      activityCalendar: this.generateSampleCalendar(),
      topics: {
        'Algorithmes de Tri': { attempts: 18, correct: 7, mastery: 38 },
        'Complexité Temporelle & Spatiale': { attempts: 15, correct: 8, mastery: 53 },
        'Arbres Binaires & AVL': { attempts: 22, correct: 14, mastery: 63 },
        'Bases de Données Relationnelles (SQL)': { attempts: 30, correct: 28, mastery: 93 },
        'Algèbre Linéaire & Matrices': { attempts: 25, correct: 22, mastery: 88 },
        'Réseaux & Modèle OSI': { attempts: 12, correct: 9, mastery: 75 },
        'Droit Constitutionnel': { attempts: 0, correct: 0, mastery: 0 },
        'Microéconomie': { attempts: 0, correct: 0, mastery: 0 }
      },
      history: []
    };
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  generateSampleCalendar() {
    const cal = {};
    const today = new Date();
    for (let i = 0; i < 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      // Random activity for visual calendar
      cal[key] = i < 7 ? Math.floor(Math.random() * 4) + 1 : (i % 3 === 0 ? 0 : Math.floor(Math.random() * 3) + 1);
    }
    return cal;
  }

  recordQuizResult(subject, chapter, score, total, questions = []) {
    const pct = total > 0 ? (score / total) * 100 : 0;
    const earnedXp = score * 15 + 10;
    this.data.xp += earnedXp;

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    if (this.data.lastActiveDate !== today) {
      const lastDate = new Date(this.data.lastActiveDate);
      const currDate = new Date(today);
      const diffDays = Math.round((currDate - lastDate) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        this.data.streak += 1;
        if (this.data.streak > this.data.bestStreak) {
          this.data.bestStreak = this.data.streak;
        }
      } else if (diffDays > 1) {
        this.data.streak = 1;
      }
      this.data.lastActiveDate = today;
    }

    if (!this.data.activityCalendar) this.data.activityCalendar = {};
    this.data.activityCalendar[today] = (this.data.activityCalendar[today] || 0) + 1;

    // Update topic mastery
    const topicKey = chapter || subject || 'Général';
    if (!this.data.topics[topicKey]) {
      this.data.topics[topicKey] = { attempts: 0, correct: 0, mastery: 0 };
    }
    const t = this.data.topics[topicKey];
    t.attempts += total;
    t.correct += score;
    t.mastery = Math.round((t.correct / t.attempts) * 100);

    this.data.history.unshift({
      date: new Date().toISOString(),
      subject,
      chapter: topicKey,
      score,
      total,
      pct: Math.round(pct),
      xp: earnedXp
    });

    this.save();
    return {
      earnedXp,
      newTotalXp: this.data.xp,
      currentLevel: this.getLevel(),
      streak: this.data.streak
    };
  }

  getLevel() {
    const xp = this.data.xp;
    for (let i = ACADEMIC_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= ACADEMIC_LEVELS[i].minXp) {
        const next = ACADEMIC_LEVELS[i + 1] || ACADEMIC_LEVELS[i];
        const progressInLevel = xp - ACADEMIC_LEVELS[i].minXp;
        const levelRange = (next.minXp - ACADEMIC_LEVELS[i].minXp) || 100;
        const pct = Math.min(100, Math.round((progressInLevel / levelRange) * 100));
        return {
          ...ACADEMIC_LEVELS[i],
          nextLevel: next.name,
          currentXp: xp,
          nextXp: next.minXp,
          progressPct: pct
        };
      }
    }
    return ACADEMIC_LEVELS[0];
  }

  getWeakTopics() {
    const weak = [];
    Object.entries(this.data.topics).forEach(([name, stats]) => {
      if (stats.attempts > 0 && stats.mastery < 60) {
        weak.push({ name, ...stats });
      }
    });
    return weak.sort((a, b) => a.mastery - b.mastery);
  }

  getStrongTopics() {
    const strong = [];
    Object.entries(this.data.topics).forEach(([name, stats]) => {
      if (stats.attempts >= 5 && stats.mastery >= 75) {
        strong.push({ name, ...stats });
      }
    });
    return strong.sort((a, b) => b.mastery - a.mastery);
  }

  getUnstudiedTopics() {
    const unstudied = [];
    Object.entries(this.data.topics).forEach(([name, stats]) => {
      if (stats.attempts === 0) {
        unstudied.push(name);
      }
    });
    return unstudied;
  }
}

export const adaptiveEngine = new AdaptiveEngine();
window.adaptiveEngine = adaptiveEngine;
