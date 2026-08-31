// ============================================================
// CAMPUSLY 2.0 — examService.js
// Gestion des Compositions Surveillées, Proctoring & Copies UAC
// ============================================================

import { MOCK_COMPOSITIONS } from './mockData.js';
import { userService } from './userService.js';

const STORAGE_KEY = 'campusly_compositions';

export class ExamService {
  constructor() {
    this.compositions = this.loadCompositions();
  }

  loadCompositions() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(c => this.normalizeComposition(c));
        }
      }
    } catch (e) {
      console.warn('Error loading compositions', e);
    }
    const initialized = MOCK_COMPOSITIONS.map(c => this.normalizeComposition(c));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialized));
    return initialized;
  }

  normalizeComposition(c) {
    const questions = (c.questions || []).map((q, idx) => ({
      ...q,
      id: q.id || `cq_${idx + 1}`,
      prompt: q.prompt || q.text || `Question ${idx + 1}`,
      text: q.text || q.prompt || `Question ${idx + 1}`,
      points: q.points || Math.round((20 / Math.max(1, (c.questions || []).length)) * 10) / 10 || 2.5
    }));

    return {
      ...c,
      className: c.className || c.classroom || 'Licence 2 Informatique (FAST)',
      teacherName: c.teacherName || c.professor || 'Dr. Kokou Mensah',
      durationMinutes: c.durationMinutes || 45,
      totalPoints: c.totalPoints || 20,
      passMark: c.passMark || 10,
      questions
    };
  }

  getCompositionById(id) {
    return this.compositions.find(c => c.id === id) || this.compositions[0];
  }

  submitComposition(compId, { studentName = 'Étudiant UAC', matricule = '2025-UAC-889', answers = {}, proctoringLogs = [], durationSeconds = 0 }) {
    const comp = this.getCompositionById(compId);
    let totalScore = 0;
    const gradedQuestions = [];
    const qCount = comp.questions.length || 1;
    const maxPerQ = Math.round((20 / qCount) * 10) / 10;

    comp.questions.forEach((q) => {
      const userAns = answers[q.id];
      let isCorrect = false;
      let earnedPoints = 0;

      if (q.type === 'qcm') {
        const correct = q.correctIndex !== undefined ? q.correctIndex : q.correctAnswer;
        isCorrect = Number(userAns) === Number(correct);
        earnedPoints = isCorrect ? maxPerQ : 0;
      } else if (q.type === 'true_false') {
        const targetBool = q.correctBoolean !== undefined ? q.correctBoolean : (q.correctAnswer === true || q.correctAnswer === 'true');
        isCorrect = (String(userAns) === 'true' && targetBool === true) || (String(userAns) === 'false' && targetBool === false);
        earnedPoints = isCorrect ? maxPerQ : 0;
      } else if (q.type === 'open') {
        const text = (String(userAns || '')).toLowerCase();
        const keywords = q.keywords || ['arbre', 'file', 'complexité', 'mémoïsation', 'récursion'];
        const matches = keywords.filter(k => text.includes(k.toLowerCase())).length;
        isCorrect = matches >= 2;
        earnedPoints = isCorrect ? maxPerQ : (matches > 0 ? Math.round(maxPerQ * 0.5 * 10) / 10 : 0);
      }

      totalScore += earnedPoints;

      gradedQuestions.push({
        id: q.id,
        prompt: q.prompt || q.text,
        userAnswer: userAns,
        isCorrect,
        earnedPoints: Math.round(earnedPoints * 10) / 10,
        maxPoints: maxPerQ,
        explanation: q.explanation || q.sampleAnswer || "Consultez le cours magistral pour la démonstration complète."
      });
    });

    const scoreOn20 = Math.min(20, Math.round(totalScore * 10) / 10);
    const pass = scoreOn20 >= comp.passMark;

    // Enregistrer dans le profil utilisateur pour les statistiques
    try {
      userService.recordQuizResult({
        subject: comp.title,
        score: scoreOn20,
        total: 20
      });
    } catch (e) {
      console.warn('Could not record quiz in userService', e);
    }

    const copyResult = {
      id: `copy_${Date.now()}`,
      compId,
      compTitle: comp.title,
      studentName,
      matricule,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      scoreOn20,
      grade: scoreOn20,
      total: 20,
      pass,
      durationSeconds,
      proctorEventsCount: proctoringLogs.length,
      gradedQuestions,
      details: gradedQuestions,
      feedback: pass
        ? 'Très bon travail. Maîtrise solide démontrée sur la majorité des concepts théoriques et algorithmiques.'
        : 'Note insuffisante. Des révisions ciblées sont recommandées via le Marathon Adaptatif Campusly.'
    };

    localStorage.setItem(`campusly_copy_${compId}`, JSON.stringify(copyResult));
    return copyResult;
  }

  submitExam(args) {
    if (typeof args === 'object' && args.compId) {
      return this.submitComposition(args.compId, {
        answers: args.answers || {},
        proctoringLogs: args.proctorEvents || []
      });
    }
    return this.submitComposition(arguments[0], arguments[1] || {});
  }

  getSavedCopy(compId) {
    try {
      const saved = localStorage.getItem(`campusly_copy_${compId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }
}

export const examService = new ExamService();
window.examService = examService;
