"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const PLANNED_QUESTIONS = [
  "Expliquer la complexité asymptotique d'un algorithme",
  "Revoir les rotations d'un arbre AVL",
  "Comprendre le rôle des crédits Campusly",
  "Préparer une composition surveillée",
];

/**
 * Assistant Campusly AI.
 * Le service n'est pas branché : plutôt que d'afficher des réponses
 * pré-écrites comme si un modèle avait répondu, la page annonce clairement
 * l'indisponibilité et décrit ce que fera l'assistant.
 */
export function AssistantChat() {
  return (
    <div className="stack" style={{ gap: 18 }}>
      <PageHeader
        title="Assistant Campusly AI"
        subtitle="L'assistant n'est pas encore ouvert : aucune question ne peut être envoyée pour l'instant."
        actions={<Badge tone="neutral" icon="fa-solid fa-plug-circle-xmark">Service indisponible</Badge>}
      />

      <Card>
        <CardHeader title="Pourquoi l'assistant est fermé" subtitle="Le modèle d'IA n'est pas connecté" icon="fa-solid fa-comment-slash" />
        <div className="availability-note">
          <p>
            L&apos;assistant doit répondre à partir de vos cours et de votre historique, côté serveur. Tant que
            ce service n&apos;existe pas, aucune réponse n&apos;est produite ici — et surtout, aucune réponse
            inventée n&apos;est affichée à sa place.
          </p>
          <p style={{ marginBottom: 0 }}>Ce qu&apos;il fera une fois ouvert :</p>
          <ul>
            {PLANNED_QUESTIONS.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
        <div className="row" style={{ gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <Link href="/dashboard/revision" className="btn btn-primary btn-sm">
            Réviser avec les exercices
          </Link>
          <Link href="/dashboard/epreuves" className="btn btn-ghost btn-sm">
            Parcourir les épreuves
          </Link>
        </div>
      </Card>
    </div>
  );
}
