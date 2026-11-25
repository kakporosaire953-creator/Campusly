/**
 * DONNÉES DE DÉMONSTRATION — compositions surveillées
 * ---------------------------------------------------------------------------
 * Le catalogue applicatif est vide : aucune composition réelle n'est hébergée
 * et le service de compositions n'a pas encore de backend. Ces entrées
 * servent uniquement à **parcourir la salle d'examen** (attente, consignes,
 * minuterie, copie, correction locale).
 *
 * Règles tenues, comme partout ailleurs dans la démonstration :
 *  - les énoncés portent sur des notions réellement au programme de L2
 *    informatique de la FAST, ils ne sont pas des remplissages ;
 *  - la composition est **explicitement marquée** comme démonstration dans son
 *    titre, pour qu'aucun étudiant ne la confonde avec une évaluation réelle ;
 *  - les dates sont calculées autour de l'instant présent afin que la salle
 *    s'ouvre réellement quand on la visite.
 */

import type { Composition, CompositionCopy } from "@/types";

const now = Date.now();
const HOUR = 3_600_000;

/** Composition ouverte : fenêtre d'une journée autour de l'instant courant. */
const OPEN_COMPOSITION: Composition = {
  id: "demo-algo-l2",
  code: "DEMO26",
  title: "Démonstration — Algorithmique et structures de données",
  subject: "Algorithmique",
  classroomId: "demo-classe-algo",
  classroomName: "Amphi Algorithmique — L2 Informatique",
  teacherName: "Salle de démonstration Campusly",
  status: "live",
  durationMinutes: 20,
  totalPoints: 20,
  passMark: 10,
  opensAt: new Date(now - 2 * HOUR).toISOString(),
  closesAt: new Date(now + 22 * HOUR).toISOString(),
  proctoring: "standard",
  attemptsAllowed: 1,
  participantsCount: 0,
  questions: [
    {
      id: "demo-q1",
      type: "qcm",
      prompt: "Quelle est la complexité asymptotique d'une recherche dichotomique dans un tableau trié de n éléments ?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctOptionIndex: 1,
      points: 4,
      explanation:
        "Chaque comparaison divise l'intervalle de recherche par deux : le nombre d'étapes est logarithmique en la taille du tableau.",
    },
    {
      id: "demo-q2",
      type: "true_false",
      prompt: "Dans un arbre binaire de recherche équilibré, l'insertion se fait en O(log n) en moyenne.",
      correctBoolean: true,
      points: 4,
      explanation:
        "La hauteur d'un arbre équilibré est logarithmique : la descente jusqu'à la feuille d'insertion l'est aussi.",
    },
    {
      id: "demo-q3",
      type: "qcm",
      prompt: "Quelle structure garantit un accès au plus grand élément en temps constant ?",
      options: ["Une file (FIFO)", "Une pile (LIFO)", "Un tas-max", "Une liste simplement chaînée"],
      correctOptionIndex: 2,
      points: 4,
      explanation:
        "Dans un tas-max, la racine porte toujours le plus grand élément : le lire ne coûte rien, l'extraire coûte O(log n).",
    },
    {
      id: "demo-q4",
      type: "open",
      prompt: "Quel algorithme de tri a une complexité moyenne en O(n log n) et se trie sur place ?",
      keywords: ["quicksort", "tri rapide", "rapide", "quick sort"],
      points: 4,
      explanation:
        "Le tri rapide partitionne sur place ; en moyenne il est en O(n log n), avec un pire cas quadratique sur un pivot mal choisi.",
    },
    {
      id: "demo-q5",
      type: "true_false",
      prompt: "Une table de hachage peut garantir un ordre de parcours trié de ses clés.",
      correctBoolean: false,
      points: 4,
      explanation:
        "Le hachage disperse les clés : l'ordre de parcours dépend des collisions, pas des valeurs.",
    },
  ],
};

export const DEMO_COMPOSITIONS: Composition[] = [OPEN_COMPOSITION];

/** Copies : aucune au départ, la salle d'examen les crée localement. */
export const DEMO_COPIES: CompositionCopy[] = [];
