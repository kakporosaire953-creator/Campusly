/**
 * DONNÉES DE DÉMONSTRATION — bibliothèque d'épreuves
 * ---------------------------------------------------------------------------
 * Sujets fictifs inspirés des intitulés UAC. Aucun fichier n'est réellement
 * stocké : `storageKey` est un identifiant symbolique (futur objet R2).
 */

import type { Exam, ExamHistoryEntry } from "@/types";

const row = (
  id: string,
  title: string,
  subject: string,
  faculty: Exam["faculty"],
  department: string,
  level: Exam["level"],
  semester: Exam["semester"],
  academicYear: string,
  type: Exam["type"],
  isPremium: boolean,
  pages: number,
  downloads: number,
  contributorName: string,
  tags: string[],
): Exam => ({
  id,
  title,
  subject,
  faculty,
  department,
  level,
  semester,
  academicYear,
  type,
  isPremium,
  pages,
  fileSize: pages * 180_000,
  downloads,
  storageKey: `exams/${faculty}/${academicYear}/${id}.pdf`,
  contributorName,
  publishedAt: `${academicYear.slice(5, 9)}-07-15T10:00:00.000Z`,
  tags,
});

export const DEMO_EXAMS: Exam[] = [
  row("epr-001", "Algorithmique — Structures de données", "Algorithmique", "FAST", "Informatique", "L2", "S1", "2024-2025", "Examen", false, 6, 412, "Département Informatique FAST", ["arbres", "complexité", "tri"]),
  row("epr-002", "Algorithmique — Complexité asymptotique", "Algorithmique", "FAST", "Informatique", "L2", "S2", "2023-2024", "Partiel", false, 4, 356, "Département Informatique FAST", ["complexité", "big-o"]),
  row("epr-003", "Analyse réelle — Suites et séries", "Analyse", "FAST", "Mathématiques", "L1", "S1", "2024-2025", "Examen", false, 5, 289, "Département Mathématiques", ["suites", "convergence"]),
  row("epr-004", "Probabilités et statistiques", "Probabilités", "FAST", "Mathématiques", "L2", "S2", "2023-2024", "Examen", true, 7, 198, "Département Mathématiques", ["lois", "espérance"]),
  row("epr-005", "Bases de données relationnelles", "Bases de données", "FAST", "Informatique", "L2", "S2", "2024-2025", "TP", false, 3, 154, "Département Informatique FAST", ["sql", "normalisation"]),
  row("epr-006", "Comptabilité générale — Écritures", "Comptabilité", "FASEG", "Comptabilité et Finance", "L1", "S1", "2024-2025", "Examen", false, 6, 233, "Département Comptabilité", ["bilan", "journal"]),
  row("epr-007", "Microéconomie — Marchés et concurrence", "Économie", "FASEG", "Économie", "L2", "S1", "2023-2024", "Examen", true, 8, 176, "Département Économie", ["marché", "élasticité"]),
  row("epr-008", "Droit constitutionnel — Institutions béninoises", "Droit public", "FADESP", "Droit Public", "L2", "S1", "2024-2025", "Examen", false, 5, 141, "Département Droit Public", ["constitution", "institutions"]),
  row("epr-009", "Droit civil — Obligations contractuelles", "Droit privé", "FADESP", "Droit Privé", "L3", "S2", "2023-2024", "TD", false, 4, 96, "Département Droit Privé", ["contrat", "responsabilité"]),
  row("epr-010", "Résistance des matériaux", "Génie civil", "EPAC", "Génie Civil", "L3", "S1", "2024-2025", "Examen", true, 9, 88, "Département Génie Civil", ["poutres", "contraintes"]),
  row("epr-011", "Anatomie générale — Tronc commun", "Médecine", "FSS", "Médecine générale", "L1", "S1", "2024-2025", "Examen", false, 10, 205, "Département Médecine", ["ostéologie", "anatomie"]),
  row("epr-012", "Nutrition animale et pâturage", "Agronomie", "FSA", "Production Animale et Pêche", "L3", "S2", "2023-2024", "TD", false, 5, 61, "Département Production Animale", ["ration", "élevage"]),
  row("epr-013", "Comptabilité analytique — Coûts", "Comptabilité", "ENEAM", "Gestion des Entreprises", "L2", "S2", "2024-2025", "Partiel", false, 4, 74, "Département Gestion", ["coûts", "marges"]),
  row("epr-014", "Littérature africaine comparée", "Lettres", "FLLAC", "Lettres Modernes", "L2", "S1", "2023-2024", "Examen", false, 6, 52, "Département Lettres Modernes", ["roman", "négritude"]),
  row("epr-015", "Correction — Algorithmique 2024-2025", "Algorithmique", "FAST", "Informatique", "L2", "S1", "2024-2025", "Correction", false, 4, 319, "Département Informatique FAST", ["corrigé", "arbres"]),
  row("epr-016", "Sociologie de l'éducation", "Sociologie", "FASHS", "Sociologie & Anthropologie", "L1", "S2", "2024-2025", "TD", false, 3, 38, "Département Sociologie", ["socialisation", "école"]),
];

export const DEMO_EXAM_HISTORY: ExamHistoryEntry[] = [
  {
    id: "hist-1",
    examId: "epr-001",
    examTitle: "Algorithmique — Structures de données",
    faculty: "FAST",
    action: "download",
    occurredAt: "2026-10-27T18:22:00.000Z",
  },
  {
    id: "hist-2",
    examId: "epr-003",
    examTitle: "Analyse réelle — Suites et séries",
    faculty: "FAST",
    action: "download",
    occurredAt: "2026-10-25T08:41:00.000Z",
  },
  {
    id: "hist-3",
    examId: "epr-015",
    examTitle: "Correction — Algorithmique 2024-2025",
    faculty: "FAST",
    action: "view",
    occurredAt: "2026-10-23T20:05:00.000Z",
  },
];
