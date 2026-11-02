"use client";

import { useState } from "react";
import type { Exam } from "@/types";
import { examService } from "@/services/examService";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

/**
 * Actions de la fiche épreuve : favori (stocké localement) et accès au
 * document. Aucun téléchargement n'est simulé : tant que les fichiers ne sont
 * pas déposés sur le stockage objet, le bouton reste désactivé et le motif est
 * affiché.
 */
export function ExamDetailActions({ exam }: { exam: Exam }) {
  const { toast } = useToast();
  const [favorite, setFavorite] = useState(() => examService.isFavorite(exam.id));

  const toggleFavorite = async () => {
    const result = await examService.toggleFavorite(exam.id);
    setFavorite(result.favorited);
    toast(result.favorited ? "Ajouté à vos favoris." : "Retiré de vos favoris.", "info");
  };

  return (
    <div className="exam-detail-actions">
      <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
        <Button variant="primary" icon="fa-solid fa-download" disabled aria-describedby="document-status">
          Télécharger le document
        </Button>
        <Button
          variant={favorite ? "accent" : "outline"}
          icon={favorite ? "fa-solid fa-star" : "fa-regular fa-star"}
          onClick={toggleFavorite}
          aria-pressed={favorite}
        >
          {favorite ? "Dans vos favoris" : "Ajouter aux favoris"}
        </Button>
      </div>
      <p id="document-status" className="exam-document-status">
        Le fichier de cette épreuve n&apos;est pas encore disponible au téléchargement. La fiche
        reste consultable et l&apos;accès sera ouvert dès la mise en ligne des documents.
      </p>
    </div>
  );
}
