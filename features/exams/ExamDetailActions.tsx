"use client";

import { useState } from "react";
import type { Exam } from "@/types";
import { examService } from "@/services/examService";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

/** Actions de la fiche épreuve : favori + téléchargement simulé. */
export function ExamDetailActions({ exam }: { exam: Exam }) {
  const { toast } = useToast();
  const [favorite, setFavorite] = useState(() => examService.isFavorite(exam.id));
  const [modalOpen, setModalOpen] = useState(false);

  const toggleFavorite = async () => {
    const result = await examService.toggleFavorite(exam.id);
    setFavorite(result.favorited);
    toast(result.favorited ? "Ajouté aux favoris (démo)." : "Retiré des favoris (démo).", "info");
  };

  const download = async () => {
    const ticket = await examService.requestDownload(exam.id);
    setModalOpen(false);
    toast(
      `Téléchargement simulé (${ticket.creditsSpent} crédit(s) fictif(s)). Aucun fichier n'est servi.`,
      "info",
    );
  };

  return (
    <>
      <div className="row" style={{ gap: 10 }}>
        <Button variant="primary" icon="fa-solid fa-download" onClick={() => setModalOpen(true)}>
          Télécharger (simulation)
        </Button>
        <Button
          variant={favorite ? "accent" : "outline"}
          icon={favorite ? "fa-solid fa-star" : "fa-regular fa-star"}
          onClick={toggleFavorite}
          aria-pressed={favorite}
        >
          {favorite ? "Dans les favoris" : "Ajouter aux favoris"}
        </Button>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Téléchargement simulé"
        description={exam.title}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={download}>
              Confirmer la simulation
            </Button>
          </div>
        }
      >
        <p style={{ fontSize: "0.85rem", color: "var(--text-2)", lineHeight: 1.6 }}>
          Le PDF de démonstration n&apos;existe pas. En production, le Worker vérifiera vos droits
          (abonnement ou crédits), générera une URL signée R2 valable quelques minutes et journalisera le
          téléchargement.
        </p>
      </Modal>
    </>
  );
}
