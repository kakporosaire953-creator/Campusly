// ============================================================
// CAMPUSLY 2.0 — js/classrooms.js
// Hub Classrooms & Espaces Pédagogiques pour Enseignants et Étudiants
// ============================================================

import { classroomService } from './services/classroomService.js';
import { authService } from './services/authService.js';

export class ClassroomsManager {
  constructor() {
    this.classrooms = [];
    this.activeClassroom = null;
  }

  async fetchClassrooms() {
    this.classrooms = classroomService.getAllClassrooms();
    return this.classrooms;
  }

  async fetchClassroomDetails(id) {
    const cls = classroomService.getClassroomById(id);
    if (!cls) return null;
    const analytics = classroomService.getClassroomAnalytics(id);
    this.activeClassroom = { classroom: cls, analytics };
    return this.activeClassroom;
  }

  async createClassroom(formData) {
    const user = authService.getUser();
    const newCls = classroomService.createClassroom({
      ...formData,
      teacherName: `${user.prenom || 'Dr.'} ${user.nom || 'Mensah'}`
    });
    await this.fetchClassrooms();
    return newCls;
  }

  async joinClassroom(code) {
    const user = authService.getUser();
    const res = classroomService.joinClassroom(code, {
      name: `${user.prenom} ${user.nom}`,
      matricule: user.matricule || '2025-UAC-889',
      email: user.email
    });
    await this.fetchClassrooms();
    return res;
  }

  renderClassroomsList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.classrooms.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px 20px;background:var(--surface);border:1px dashed var(--border);border-radius:var(--r-lg);">
          <div style="font-size:2rem;color:var(--text-3);margin-bottom:10px;"><i class="fas fa-chalkboard"></i></div>
          <h4 style="font-weight:700;color:var(--text-1);margin-bottom:4px;">Aucune classe pour le moment</h4>
          <p style="font-size:0.85rem;color:var(--text-2);">Rejoignez une classe avec un code d'invitation ou créez votre premier groupe.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;">
        ${this.classrooms.map(c => `
          <div class="classroom-card" onclick="window.classroomsManager.openClassroomDetails('${c.id}')" style="background:var(--grad-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:24px;cursor:pointer;transition:all 0.2s ease;box-shadow:var(--shadow-sm);position:relative;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
              <span style="background:rgba(21,101,192,0.1);color:var(--brand-1);font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:var(--r-sm);text-transform:uppercase;">
                ${c.faculty || 'UAC'} · ${c.level || 'Licence'}
              </span>
              <span style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;background:var(--surface-2);border:1px solid var(--border);padding:3px 8px;border-radius:var(--r-sm);color:var(--accent);">
                ${c.code}
              </span>
            </div>

            <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-1);margin-bottom:6px;line-height:1.4;">${c.name}</h3>
            <div style="font-size:0.82rem;color:var(--text-3);margin-bottom:16px;">
              <i class="fas fa-user-tie" style="margin-right:6px;"></i> ${c.teacherName || 'Enseignant UAC'}
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:14px;font-size:0.82rem;color:var(--text-2);">
              <span><i class="fas fa-users" style="color:var(--brand-2);margin-right:6px;"></i> ${(c.students || []).length} Étudiants</span>
              <span><i class="fas fa-clipboard-check" style="color:var(--success);margin-right:6px;"></i> ${(c.assignments || []).length} Devoirs</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async openClassroomDetails(id) {
    const data = await this.fetchClassroomDetails(id);
    if (!data) return;

    const modal = document.createElement('div');
    modal.id = 'classDetailsModal';
    modal.className = 'modal-overlay show';

    const c = data.classroom;
    const stats = data.analytics;

    modal.innerHTML = `
      <div class="modal-card" style="max-width:850px;width:95%;background:var(--bg-2);border:1px solid var(--border-2);border-radius:var(--r-xl);padding:30px;max-height:90vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:16px;">
          <div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
              <span style="font-family:var(--font-mono);font-size:0.85rem;font-weight:800;color:var(--accent);background:rgba(245,124,0,0.12);padding:4px 10px;border-radius:var(--r-sm);">
                Code : ${c.code}
              </span>
              <span style="font-size:0.8rem;color:var(--text-3);">${c.faculty} · ${c.level} (${c.academicYear || '2025-2026'})</span>
            </div>
            <h2 style="font-size:1.4rem;font-weight:800;color:var(--text-1);">${c.name}</h2>
            <p style="font-size:0.85rem;color:var(--text-2);margin-top:4px;">${c.description || 'Espace pédagogique de travail collaboratif.'}</p>
          </div>
          <button class="modal-close-btn" onclick="document.getElementById('classDetailsModal').remove()" style="background:none;border:none;color:var(--text-3);font-size:1.4rem;cursor:pointer;">✕</button>
        </div>

        <!-- Teacher Dashboard Analytics -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:24px;">
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;text-align:center;">
            <div style="font-size:1.6rem;font-weight:800;color:var(--brand-1);">${stats.totalStudents}</div>
            <div style="font-size:0.75rem;color:var(--text-3);text-transform:uppercase;">Étudiants Inscrits</div>
          </div>
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;text-align:center;">
            <div style="font-size:1.6rem;font-weight:800;color:var(--success);">${stats.classAvg} / 20</div>
            <div style="font-size:0.75rem;color:var(--text-3);text-transform:uppercase;">Moyenne de Classe</div>
          </div>
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;text-align:center;">
            <div style="font-size:1.6rem;font-weight:800;color:var(--accent);">${stats.participationRate}%</div>
            <div style="font-size:0.75rem;color:var(--text-3);text-transform:uppercase;">Taux d'Engagement</div>
          </div>
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;text-align:center;">
            <div style="font-size:1.6rem;font-weight:800;color:var(--danger);">${stats.strugglingCount}</div>
            <div style="font-size:0.75rem;color:var(--text-3);text-transform:uppercase;">En Difficulté (Alerte)</div>
          </div>
        </div>

        <!-- Assignments & Resources -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-1);">Devoirs & Évaluations programmées</h3>
          <a href="composition.html?id=comp-algo-01" class="btn btn-accent btn-sm">Accéder à l'épreuve</a>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px;">
          ${(c.assignments || []).map(a => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);">
              <div>
                <strong style="font-size:0.92rem;color:var(--text-1);">${a.title}</strong>
                <div style="font-size:0.75rem;color:var(--text-3);">Échéance : ${a.dueDate || '31 Août 2026'} · Barème : /${a.points || 20}</div>
              </div>
              <span style="font-size:0.78rem;font-weight:700;color:var(--accent);">Rendu : ${a.submissionsCount || 60} / ${stats.totalStudents}</span>
            </div>
          `).join('')}
        </div>

        <div style="text-align:right;">
          <button class="btn btn-outline" onclick="document.getElementById('classDetailsModal').remove()">Fermer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }
}

export const classroomsManager = new ClassroomsManager();
window.classroomsManager = classroomsManager;
