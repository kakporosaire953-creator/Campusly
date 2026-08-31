// ============================================================
// CAMPUSLY 2.0 — classroomService.js
// Gestion des Classrooms Virtuelles, Amphis & Devoirs UAC
// ============================================================

import { MOCK_CLASSROOMS } from './mockData.js';

const STORAGE_KEY = 'campusly_classrooms';

export class ClassroomService {
  constructor() {
    this.classes = this.loadClassrooms();
  }

  loadClassrooms() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(c => this.normalizeClassroom(c));
        }
      }
    } catch (e) {
      console.warn('Error loading classrooms', e);
    }
    const initialized = MOCK_CLASSROOMS.map(c => this.normalizeClassroom(c));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialized));
    return initialized;
  }

  normalizeClassroom(c) {
    const studentsCount = c.studentsCount || (c.students ? c.students.length : 68);
    const faculty = c.faculty || c.faculte || 'FAST';
    const level = c.level || 'Licence 2';
    const students = Array.isArray(c.students) ? c.students : Array.from({ length: studentsCount }, (_, i) => ({
      id: `std_${i + 1}`,
      name: `Apprenant ${i + 1}`,
      matricule: `2025-UAC-${100 + i}`
    }));

    const assignments = Array.isArray(c.assignments) ? c.assignments : (c.exercises || [
      { id: "ex1", title: "Devoir #1 : Complexité et Tri Quicksort", points: 20, dueDate: "Terminé", submissionsCount: Math.round(studentsCount * 0.95) },
      { id: "ex2", title: "Devoir #2 : Algorithmes Gloutons & Sac à Dos", points: 20, dueDate: "Dans 2 jours", submissionsCount: Math.round(studentsCount * 0.78) }
    ]).map(e => ({
      id: e.id || `asg_${Math.random()}`,
      title: e.title,
      points: e.points || 20,
      dueDate: e.deadline || e.dueDate || "31 Août 2026",
      submissionsCount: e.submissionsCount || Math.round(studentsCount * 0.82)
    }));

    return {
      ...c,
      faculty,
      faculte: faculty,
      level,
      studentsCount,
      students,
      assignments,
      resources: c.resources || [],
      posts: c.posts || [],
      compositions: c.compositions || []
    };
  }

  saveClassrooms() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.classes));
  }

  // Compatibility methods
  getAllClassrooms() {
    return this.classes;
  }

  getAllClasses() {
    return this.classes;
  }

  getClassroomById(id) {
    return this.classes.find(c => c.id === id) || this.classes[0];
  }

  getClassById(id) {
    return this.getClassroomById(id);
  }

  getClassroomAnalytics(id) {
    const cls = this.getClassroomById(id);
    if (!cls) {
      return {
        totalStudents: 0,
        classAvg: "0.0",
        participationRate: 0,
        strugglingCount: 0
      };
    }

    const totalStudents = cls.studentsCount || (cls.students ? cls.students.length : 60);
    const avgNum = parseFloat(String(cls.average || '14.2').replace(/[^0-9.]/g, '')) || 13.8;
    const strugglingCount = Math.max(1, Math.round(totalStudents * 0.09));
    const participationRate = Math.min(98, Math.round(85 + (totalStudents % 10)));

    return {
      totalStudents,
      classAvg: avgNum.toFixed(1),
      participationRate,
      strugglingCount
    };
  }

  createClassroom({ name, subject, faculty, faculte, level = 'Licence 2', description = '', teacherName = 'Dr. Kokou Mensah' }) {
    const fac = faculty || faculte || 'FAST';
    const subj = subject || name || 'Cours';
    const code = `UAC-${fac.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newClass = {
      id: `cls-${Date.now()}`,
      code,
      name,
      subject: subj,
      faculty: fac,
      faculte: fac,
      level,
      teacherName,
      teacherAvatar: teacherName.split(' ').map(n => n[0]).join('').substring(0, 2),
      studentsCount: 1,
      students: [
        { id: `std_1`, name: "Moi (Enseignant/Délégué)", matricule: "2025-UAC-001" }
      ],
      average: "14.5 / 20",
      color: "#1565C0",
      description,
      posts: [
        {
          id: `p_${Date.now()}`,
          author: teacherName,
          date: "À l'instant",
          content: `Bienvenue dans la classe ${name}. Les ressources et annonces de cours seront publiées ici.`,
          pinned: true
        }
      ],
      resources: [],
      exercises: [],
      assignments: [],
      compositions: []
    };

    this.classes.unshift(newClass);
    this.saveClassrooms();
    return newClass;
  }

  createClass(args) {
    return this.createClassroom(args);
  }

  joinClassroom(code, studentData = {}) {
    const cleanCode = (code || '').trim().toUpperCase();
    const found = this.classes.find(c => c.code.toUpperCase() === cleanCode);
    if (!found) {
      throw new Error(`Aucune classe trouvée avec le code "${code}". Vérifiez auprès de votre enseignant.`);
    }

    if (!Array.isArray(found.students)) {
      found.students = [];
    }

    const alreadyIn = found.students.some(s => s.matricule && s.matricule === studentData.matricule);
    if (!alreadyIn) {
      found.students.push({
        id: `std_${Date.now()}`,
        name: studentData.name || 'Nouvel Apprenant',
        matricule: studentData.matricule || `2025-UAC-${Math.floor(100 + Math.random() * 900)}`
      });
      found.studentsCount = found.students.length;
      this.saveClassrooms();
    }

    return {
      success: true,
      message: `Félicitations ! Vous avez rejoint la classe "${found.name}".`,
      classroom: found
    };
  }

  joinClassByCode(code) {
    return this.joinClassroom(code);
  }

  addPost(classId, content, author = "Dr. Kokou Mensah") {
    const cls = this.getClassById(classId);
    if (!cls) return;
    const post = {
      id: `p_${Date.now()}`,
      author,
      date: "À l'instant",
      content,
      pinned: false
    };
    cls.posts = [post, ...(cls.posts || [])];
    this.saveClassrooms();
    return post;
  }

  addResource(classId, { title, size = '1.5 Mo' }) {
    const cls = this.getClassById(classId);
    if (!cls) return;
    const res = {
      id: `r_${Date.now()}`,
      title,
      size,
      downloads: 0,
      date: "À l'instant"
    };
    cls.resources = [res, ...(cls.resources || [])];
    this.saveClassrooms();
    return res;
  }
}

export const classroomService = new ClassroomService();
window.classroomService = classroomService;
