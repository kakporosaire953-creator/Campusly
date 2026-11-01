/**
 * aiService — SIMULATION frontend
 * ---------------------------------------------------------------------------
 * ⚠️ Aucun modèle n'est appelé. Les réponses de l'assistant et l'analyse de
 * document proviennent de fixtures pédagogiques marquées comme telles.
 *
 * En production (architecture multi-fournisseurs) :
 *   POST /api/ai/analyze-document → Worker → routeur IA (Groq / Gemini / autres)
 *   POST /api/ai/chat            → Worker → routeur IA + contexte académique
 *   GET  /api/ai/status          → fournisseurs disponibles et mode de routage
 * Les clés d'API resteront exclusivement côté Worker (secrets Cloudflare).
 */

import type {
  AiChatInput,
  AiChatReply,
  AiProviderStatus,
  AiServiceContract,
  DocumentAnalysis,
  FacultyCode,
} from "@/types";
import { ApiError } from "./api/client";
import { DEMO_DOCUMENT_ANALYSIS } from "./mocks/fixtures/quizzes";
import { demoDelay, nowIso, uid } from "./mocks/store";

const DEMO_ANSWERS: Array<{ test: RegExp; answer: string; footnotes: string[] }> = [
  {
    test: /complexit|big-?o|notation/i,
    answer:
      "La notation O décrit un majorant asymptotique : f(n) = O(g(n)) s'il existe une constante c > 0 et un rang n₀ tels que f(n) ≤ c·g(n) pour tout n ≥ n₀.\n\nEn pratique, pour un examen UAC : identifiez d'abord le cas étudié (pire, moyen, meilleur), puis simplifiez en ne gardant que le terme dominant.",
    footnotes: ["Réponse de démonstration — aucune IA n'est interrogée.", "Source : cours d'Algorithmique, chapitre 3."],
  },
  {
    test: /avl|arbre|rotation/i,
    answer:
      "Un arbre AVL est un arbre binaire de recherche dont chaque nœud a un facteur d'équilibre dans {-1, 0, +1}. Après une insertion, on identifie le premier nœud déséquilibré en remontant vers la racine, puis on applique une rotation simple ou double.",
    footnotes: ["Réponse de démonstration.", "Voir aussi le sujet du forum « Comment retenir les rotations AVL »."],
  },
  {
    test: /crédit|credit|abonnement/i,
    answer:
      "Les crédits financent les actions IA (analyse de document, génération de quiz) et certains téléchargements d'épreuves. Avec un abonnement actif, les téléchargements sont inclus.",
    footnotes: ["Réponse de démonstration.", "Le solde affiché dans cette interface est fictif."],
  },
  {
    test: /composition|examen|proctor/i,
    answer:
      "Une composition surveillée combine un code d'accès, une fenêtre de disponibilité, une minuterie et un journal d'intégrité. Les événements (changement d'onglet, sortie du plein écran) sont journalisés puis revus par l'enseignant : ils ne déclenchent pas de sanction automatique.",
    footnotes: ["Réponse de démonstration."],
  },
];

class AiService implements AiServiceContract {
  async analyzeDocument(input: {
    fileName: string;
    text?: string;
    faculty: FacultyCode;
    subject: string;
  }): Promise<DocumentAnalysis> {
    await demoDelay(900);
    if (!input.fileName) {
      throw ApiError.of("VALIDATION", "Sélectionnez un document à analyser.", { file: "Fichier requis" });
    }
    const isPdf = input.fileName.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      throw ApiError.of("VALIDATION", "Seuls les PDF sont acceptés pour la démonstration.", {
        file: "Format attendu : .pdf",
      });
    }
    return {
      ...DEMO_DOCUMENT_ANALYSIS,
      id: uid("doc"),
      fileName: input.fileName,
      detectedFaculty: input.faculty,
      detectedSubject: input.subject || DEMO_DOCUMENT_ANALYSIS.detectedSubject,
    };
  }

  async chat(input: AiChatInput): Promise<AiChatReply> {
    await demoDelay(650);
    if (!input.message.trim()) {
      throw ApiError.of("VALIDATION", "Écrivez une question.");
    }
    const match = DEMO_ANSWERS.find((entry) => entry.test.test(input.message));

    return {
      conversationId: input.conversationId ?? uid("conv"),
      message: {
        id: uid("msg"),
        role: "assistant",
        content:
          match?.answer ??
          "Je n'ai pas de réponse de démonstration pour cette question. En production, le Worker interrogera un fournisseur IA en tenant compte de votre faculté, de vos cours et de votre historique de révision.",
        createdAt: nowIso(),
        footnotes: match?.footnotes ?? ["Réponse de démonstration — aucune IA n'est interrogée."],
      },
      creditsSpent: 0,
    };
  }

  async status(): Promise<AiProviderStatus> {
    await demoDelay(40);
    return {
      providers: [
        { id: "primary", label: "Fournisseur principal (à configurer)", available: false },
        { id: "fallback", label: "Fournisseur de secours (à configurer)", available: false },
      ],
      routing: "auto",
    };
  }
}

export const aiService = new AiService();
