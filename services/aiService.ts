/**
 * aiService — socle frontend, AUCUNE IA
 * ---------------------------------------------------------------------------
 * Aucun modèle n'est appelé et aucune réponse n'est fabriquée : une réponse
 * inventée présentée comme celle de l'assistant serait trompeuse. Les deux
 * opérations valident leurs entrées puis répondent que le service n'est pas
 * encore ouvert.
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
import { demoDelay } from "./mocks/store";

const UNAVAILABLE = "L'assistant Campusly AI n'est pas encore ouvert.";

class AiService implements AiServiceContract {
  async analyzeDocument(input: {
    fileName: string;
    text?: string;
    faculty: FacultyCode;
    subject: string;
  }): Promise<DocumentAnalysis> {
    await demoDelay(200);
    if (!input.fileName) {
      throw ApiError.of("VALIDATION", "Sélectionnez un document à analyser.", { file: "Fichier requis" });
    }
    if (!input.fileName.toLowerCase().endsWith(".pdf")) {
      throw ApiError.of("VALIDATION", "Seuls les PDF seront acceptés.", {
        file: "Format attendu : .pdf",
      });
    }
    if (!input.subject?.trim()) {
      throw ApiError.of("VALIDATION", "Indiquez la matière du document.", { subject: "Champ obligatoire" });
    }

    throw ApiError.of("BACKEND_UNAVAILABLE", "L'analyse de document n'est pas encore ouverte.");
  }

  async chat(input: AiChatInput): Promise<AiChatReply> {
    await demoDelay(200);
    if (!input.message.trim()) {
      throw ApiError.of("VALIDATION", "Écrivez une question.");
    }
    throw ApiError.of("BACKEND_UNAVAILABLE", UNAVAILABLE);
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
