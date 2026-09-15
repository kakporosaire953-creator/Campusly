// ============================================================
// CAMPUSLY 2.0 — authService.js
// Gestion locale et simulée de l'authentification et des rôles
// ============================================================

const INITIAL_USER = { 
  id: 'usr_default_1',
  prenom: 'Rosaire', 
  nom: 'Kakpo', 
  name: 'Rosaire Kakpo',
  role: 'learner', 
  matricule: '23180001',
  faculte: 'FAST',
  departement: 'Informatique',
  credits: 120, 
  email: 'rosaire.kakpo@uac.bj', 
  uid: 'usr_default_1', 
  recentActivities: [] 
};

const MOCK_TEACHER_PROFILE = { 
  id: 'usr_teacher_1',
  prenom: 'Dr. Komlan', 
  nom: 'Agboton', 
  name: 'Dr. Komlan Agboton',
  titre: 'Enseignant Chercheur',
  faculte: 'FAST',
  departement: 'Informatique',
  role: 'teacher', 
  teacherStatus: 'verified',
  credits: 500, 
  email: 'komlan.agboton@uac.bj', 
  uid: 'usr_teacher_1' 
};

const STORAGE_KEY = 'campusly_auth_user';

export class AuthService {
  constructor() {
    this.user = this.loadUser();
  }

  loadUser() {
    try {
      const isLoggedOut = localStorage.getItem('campusly_user_logged_out');
      if (isLoggedOut === 'true') {
        return null;
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return { ...INITIAL_USER };
    } catch (e) {
      console.warn('Error reading saved user', e);
      return { ...INITIAL_USER };
    }
  }

  saveUser() {
    if (this.user) {
      localStorage.removeItem('campusly_user_logged_out');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem('campusly_user_logged_out', 'true');
    }
    window.dispatchEvent(new CustomEvent('campusly_user_updated', { detail: this.user }));
  }

  getUser() {
    if (!this.user) {
      this.user = this.loadUser();
    }
    return this.user;
  }

  protectRoute(allowedRoles = []) {
    if (!this.user) {
      window.location.href = 'auth.html';
      return false;
    }
    
    // Check role if specified
    if (allowedRoles.length > 0) {
       const userRole = this.user.role === 'verified_teacher' || this.user.role === 'pending_teacher' || this.user.role === 'teacher' ? 'teacher' : 'learner';
       if (!allowedRoles.includes(userRole)) {
          if (userRole === 'teacher') {
             // window.location.href = 'dashboard.html'; // Or teacher dashboard?
             return false;
          } else {
             // window.location.href = 'dashboard.html';
             return false;
          }
       }
    }
    return true;
  }

  isLoggedIn() {
    return !!this.user;
  }

  isTeacher() {
    return this.user?.role === 'verified_teacher' || this.user?.role === 'pending_teacher';
  }

  isVerifiedTeacher() {
    return this.user?.role === 'verified_teacher';
  }

  async login(param1, param2) {
    let identifier = '';
    let password = '';
    
    if (typeof param1 === 'object' && param1 !== null) {
      identifier = param1.identifier || param1.email || param1.matricule || '';
      password = param1.password || '';
    } else {
      identifier = String(param1 || '');
      password = String(param2 || '');
    }

    // Simulation réaliste de connexion
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const identLower = identifier.toLowerCase();
    // Si l'utilisateur tape un identifiant de professeur
    if (identLower.includes('prof') || identLower.includes('mensah') || identLower.includes('enseignant')) {
      this.user = { ...MOCK_TEACHER_PROFILE };
    } else {
      this.user = {
        ...INITIAL_USER,
        email: identifier.includes('@') ? identifier : `${identifier}@uac.bj`,
        matricule: identifier.replace(/\D/g, '') || INITIAL_USER.matricule
      };
    }

    this.saveUser();
    return { success: true, user: this.user };
  }

  async register(params = {}) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const role = params.role || 'learner';
    const prenom = params.prenom || 'Apprenant';
    const nom = params.nom || 'UAC';
    const emailOrMatricule = params.emailOrMatricule || params.email || params.matricule || `${prenom.toLowerCase()}.${nom.toLowerCase()}@uac.bj`;
    const faculte = params.faculte || params.faculty || 'FAST';
    const departement = params.departement || params.department || 'Informatique';
    const matricule = params.matricule || (emailOrMatricule.includes('@') ? '23180001' : emailOrMatricule.replace(/\D/g, '')) || '23180001';
    const email = emailOrMatricule.includes('@') ? emailOrMatricule : `${prenom.toLowerCase()}.${nom.toLowerCase()}@uac.bj`;

    const isTeacherRole = role === 'teacher' || role === 'pending_teacher' || role === 'verified_teacher';
    
    this.user = {
      ...INITIAL_USER,
      id: 'usr_' + Date.now(),
      prenom,
      nom,
      email,
      matricule,
      faculte,
      departement,
      role: isTeacherRole ? 'pending_teacher' : 'learner',
      teacherStatus: isTeacherRole ? 'pending' : 'none'
    };

    this.saveUser();
    return { success: true, user: this.user };
  }

  async loginWithGoogle() {
    await new Promise(resolve => setTimeout(resolve, 400));
    this.user = {
      ...INITIAL_USER,
      email: 'google.user@gmail.com',
      prenom: 'Étudiant',
      nom: 'Google'
    };
    this.saveUser();
    return { success: true, user: this.user };
  }

  async logout() {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.user = null;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('campusly_user_logged_out'));
    return { success: true };
  }

  updateProfile(updates) {
    this.user = { ...this.user, ...updates };
    this.saveUser();
    return this.user;
  }

  // Switch role for interactive testing (Permet de basculer instantanément entre Apprenant et Professeur)
  switchRole(targetRole) {
    if (targetRole === 'teacher' || targetRole === 'verified_teacher') {
      this.user = { ...MOCK_TEACHER_PROFILE };
    } else {
      this.user = { ...INITIAL_USER };
    }
    this.saveUser();
    return this.user;
  }

  requestTeacherActivation({ name = '', email = '', faculte = '', departement = '', title = '', invitationCode = '' } = {}) {
    const isImmediate = invitationCode && invitationCode.toUpperCase().includes('UAC');
    this.user = {
      ...this.user,
      prenom: name.split(' ')[0] || 'Dr.',
      nom: name.split(' ').slice(1).join(' ') || 'Enseignant',
      email: email || this.user.email,
      titre: title || 'Enseignant Chercheur',
      faculte: faculte || this.user.faculte,
      departement: departement || this.user.departement,
      role: isImmediate ? 'verified_teacher' : 'pending_teacher',
      teacherStatus: isImmediate ? 'verified' : 'pending'
    };
    this.saveUser();
    return {
      status: this.user.teacherStatus,
      message: isImmediate 
        ? 'Code valide : Votre statut Enseignant UAC a été vérifié avec succès !'
        : 'Votre demande d\'activation Enseignant a été soumise au secrétariat académique.'
    };
  }
}

export const authService = new AuthService();
window.authService = authService;
