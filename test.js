
  import { authService } from './js/services/authService.js';
  import { userService } from './js/services/userService.js';
  import { creditService } from './js/services/creditService.js';
  import './js/theme.js';


  
  window.handleJoinComposition = function(e) {
    e.preventDefault();
    const code = document.getElementById('compCodeInput').value.trim().toUpperCase();
    const errorEl = document.getElementById('joinCompError');
    errorEl.style.display = 'none';
    
    if (code.length < 5) {
      errorEl.textContent = "Code invalide. Veuillez entrer un code complet.";
      errorEl.style.display = 'block';
      return;
    }
    
    // Simuler une vérification backend
    if (code !== 'CMP-7K4P92' && code !== 'TEST26') {
      errorEl.textContent = "Code introuvable ou épreuve non ouverte. Vérifiez le code fourni.";
      errorEl.style.display = 'block';
      return;
    }
    
    // Code valide, redirection vers la salle d'attente de l'examen
    window.location.href = `exam-room.html?code=${code}`;
  };

  window.navigateToView = function(viewId) {
    // 1. Hide all views
    document.querySelectorAll('.dash-view').forEach(el => el.style.display = 'none');
    
    // 2. Show target view
    const target = document.getElementById('view-' + viewId);
    if (target) {
      target.style.display = 'block';
      // Trigger animation
      target.style.opacity = '0';
      target.style.transform = 'translateY(10px)';
      setTimeout(() => {
        target.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
      }, 10);
    }
    
    // 3. Update sidebar active state
    document.querySelectorAll('.side-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.side-link[data-view="${viewId}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    // 4. Update breadcrumb
    const breadcrumbLabel = activeLink ? activeLink.querySelector('span').textContent : 'Tableau de bord';
    const dashTitle = document.querySelector('[data-i18n="dash_title"]');
    if (dashTitle) dashTitle.textContent = breadcrumbLabel;
    
    // 5. Close sidebar on mobile
    if (window.innerWidth <= 1024) {
      const sb = document.getElementById('appSidebar');
      if (sb) sb.classList.remove('show');
    }
  };

  // Add click listeners to sidebar links
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.side-link[data-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = link.getAttribute('data-view');
        // Handle external pages that haven't been ported yet
        if (viewId === 'revision') {
          window.location.href = viewId + '.html';
          return;
        }
        window.navigateToView(viewId);
      });
    });
    
    // Handle initial hash
    if (window.location.hash) {
      const initialView = window.location.hash.replace('#', '');
      if (['overview', 'classrooms', 'epreuves', 'forum', 'composition'].includes(initialView)) {
        window.navigateToView(initialView);
      }
    }
  });

  function renderDashboard() {
    const user = authService.getUser();
    const isTeacher = user.role === 'teacher';

    // Sidebar user info
    const initials = (user.prenom ? user.prenom[0] : 'R') + (user.nom ? user.nom[0] : 'O');
    const avatarEl = document.getElementById('sideUserAvatar');
    if (avatarEl) avatarEl.textContent = initials.toUpperCase();

    const nameEl = document.getElementById('sideUserName');
    if (nameEl) nameEl.textContent = `${user.prenom || 'Rosaire'} ${user.nom ? user.nom[0] + '.' : 'O.'}`;

    const sideBadge = document.getElementById('sideRoleBadge');
    if (sideBadge) {
      sideBadge.className = `role-badge ${isTeacher ? 'teacher' : 'learner'}`;
      sideBadge.innerHTML = isTeacher 
        ? '<i class="fa-solid fa-chalkboard-user"></i> <span>Professeur</span>' 
        : '<i class="fa-solid fa-user-graduate"></i> <span>Étudiant UAC</span>';
    }

    const switchText = document.getElementById('sideRoleSwitchText');
    if (switchText) {
      switchText.textContent = isTeacher ? 'Passer en mode Étudiant' : 'Passer en mode Professeur';
    }

    // Main header greeting
    const dashTitle = document.getElementById('dashTitle');
    if (dashTitle) {
      dashTitle.textContent = isTeacher
        ? `Bonjour ${user.prenom || 'Dr.'} ${user.nom || 'Mensah'}`
        : `Bonjour ${user.prenom || 'Rosaire'}`;
    }

    const mainBadge = document.getElementById('roleBadge');
    if (mainBadge) {
      mainBadge.className = `role-badge ${isTeacher ? 'teacher' : 'learner'}`;
      mainBadge.innerHTML = isTeacher 
        ? '<i class="fa-solid fa-chalkboard-user"></i> Enseignant / Professeur' 
        : '<i class="fa-solid fa-user-graduate"></i> Apprenant / Étudiant';
    }

    const toggleBtn = document.getElementById('toggleRoleBtn');
    if (toggleBtn) {
      toggleBtn.innerHTML = isTeacher 
        ? '<i class="fa-solid fa-repeat" style="margin-right:6px;"></i> Passer en mode Apprenant' 
        : '<i class="fa-solid fa-repeat" style="margin-right:6px;"></i> Passer en mode Professeur';
    }

    document.getElementById('learnerView').style.display = isTeacher ? 'none' : 'block';
    document.getElementById('teacherView').style.display = isTeacher ? 'block' : 'none';
    document.getElementById('teacherClassroomActions').style.display = isTeacher ? 'flex' : 'none';

    document.getElementById('teacherCompositionView').style.display = isTeacher ? 'block' : 'none';
    document.getElementById('learnerCompositionView').style.display = isTeacher ? 'none' : 'block';

    document.getElementById('learnerClassroomActions').style.display = isTeacher ? 'none' : 'flex';

    if (!isTeacher) {
      const data = userService.getLearnerDashboardData();
      const levelIcon = document.getElementById('levelIcon');
      if (levelIcon) levelIcon.innerHTML = data.academicLevel.icon;
      
      const levelName = document.getElementById('levelName');
      if (levelName) levelName.textContent = data.academicLevel.name;

      const levelProgress = document.getElementById('levelProgress');
      if (levelProgress) levelProgress.textContent = `${data.academicLevel.xp} / ${data.academicLevel.nextThreshold} XP (${data.academicLevel.progressPercent}%)`;

      const progressBar = document.getElementById('levelProgressBar');
      if (progressBar) progressBar.style.width = `${data.academicLevel.progressPercent}%`;

      const metricCredits = document.getElementById('metricCredits');
      if (metricCredits) metricCredits.textContent = `${data.credits} crédits`;

      const metricStreak = document.getElementById('metricStreak');
      if (metricStreak) metricStreak.textContent = `${data.streak} Jours consécutifs`;
    }

    const creditsCountEl = document.getElementById('metricCreditsCount');
    if (creditsCountEl) creditsCountEl.textContent = creditService.getBalance();

    creditService.updatePillUI();
  }

  window.toggleUserRole = async function() {
    const user = authService.getUser();
    const nextRole = user.role === 'teacher' ? 'learner' : 'teacher';
    await authService.switchRole(nextRole);
    renderDashboard();
  };

  window.handleLogout = async function() {
    try {
      await authService.logout();
    } catch(e) {}
    localStorage.removeItem('campusly_user');
    localStorage.removeItem('campusly_auth_user');
    window.location.href = 'auth.html';
  };

  window.toggleSidebar = function() {
    const sb = document.getElementById('appSidebar');
    if (sb) sb.classList.toggle('show');
  };

  renderDashboard();
