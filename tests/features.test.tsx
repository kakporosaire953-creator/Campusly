import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ExamLibrary } from "@/features/exams/ExamLibrary";
import { QuizRunner } from "@/features/revision/QuizRunner";
import { quizService } from "@/services/quizService";
import { demoStore } from "@/services/mocks/store";

/**
 * Tests d'intégration des parcours clés, sans backend.
 * Les services sont réels (mocks locaux) : on vérifie donc le comportement
 * observable de l'interface, pas seulement le rendu.
 */
function withProviders(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe("Bibliothèque d'épreuves", () => {
  it("affiche un état vide explicite quand aucun document n'est publié", async () => {
    withProviders(<ExamLibrary />);

    expect(
      await screen.findByText(/La bibliothèque ouvre bientôt/i, undefined, { timeout: 4000 }),
    ).toBeInTheDocument();
    // Aucune carte d'épreuve, donc aucune fausse fiche.
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.queryByText(/Télécharger/i)).not.toBeInTheDocument();
  });

  it("conserve la recherche et les filtres et propose de les réinitialiser", async () => {
    const user = userEvent.setup();
    withProviders(<ExamLibrary />);

    await screen.findByText(/La bibliothèque ouvre bientôt/i, undefined, { timeout: 4000 });

    // Les contrôles de filtrage restent présents et reliés à leurs libellés.
    expect(screen.getByLabelText("Rechercher")).toBeInTheDocument();
    expect(screen.getByLabelText("Faculté")).toBeInTheDocument();
    expect(screen.getByLabelText("Niveau")).toBeInTheDocument();
    expect(screen.getByLabelText("Semestre")).toBeInTheDocument();
    expect(screen.getByLabelText("Année")).toBeInTheDocument();
    expect(screen.getByLabelText("Type")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Rechercher"), "algorithmique");

    // Avec un filtre actif, le message devient « aucun résultat ».
    expect(
      await screen.findByText(/Aucune épreuve ne correspond à ces filtres/i, undefined, { timeout: 4000 }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Réinitialiser les filtres/i }));
    expect(
      await screen.findByText(/La bibliothèque ouvre bientôt/i, undefined, { timeout: 4000 }),
    ).toBeInTheDocument();
  });
});

describe("QuizRunner", () => {
  it("répond aux questions et affiche un résultat local", async () => {
    demoStore.resetAll();
    const user = userEvent.setup();
    const quiz = await quizService.generate({
      source: "topic",
      topic: "Algorithmique",
      subject: "Algorithmique",
      faculty: "FAST",
      difficulty: "Débutant",
      questionCount: 2,
      mode: "qcm",
    });

    withProviders(<QuizRunner quiz={quiz} onExit={() => undefined} />);

    // Parcourt toutes les questions en sélectionnant la première option.
    for (let index = 0; index < quiz.questions.length; index += 1) {
      const options = screen.getAllByRole("radio");
      await user.click(options[0]);
      expect(options[0]).toHaveAttribute("aria-checked", "true");

      const isLast = index === quiz.questions.length - 1;
      await user.click(screen.getByRole("button", { name: isLast ? /Terminer/i : /Suivant/i }));
    }

    expect(await screen.findByText("Résultat du quiz", undefined, { timeout: 4000 })).toBeInTheDocument();
    expect(screen.getByText(/correction locale, non officielle/i)).toBeInTheDocument();
    expect(screen.getByText("Score global")).toBeInTheDocument();
    // La note n'est jamais présentée comme officielle.
    expect(screen.queryByText(/note officielle/i)).not.toBeInTheDocument();
  });

  it("propose de recommencer après le résultat", async () => {
    demoStore.resetAll();
    const user = userEvent.setup();
    const quiz = await quizService.generate({
      source: "topic",
      topic: "Bases de données",
      subject: "Bases de données",
      faculty: "FAST",
      difficulty: "Débutant",
      questionCount: 1,
      mode: "qcm",
    });

    withProviders(<QuizRunner quiz={quiz} onExit={() => undefined} />);
    await user.click(screen.getAllByRole("radio")[0]);
    await user.click(screen.getByRole("button", { name: /Terminer/i }));

    const retry = await screen.findByRole("button", { name: /Refaire le quiz/i }, { timeout: 4000 });
    await user.click(retry);
    expect(screen.queryByText("Résultat du quiz")).not.toBeInTheDocument();
    expect(screen.getByText(/Question 1 sur/i)).toBeInTheDocument();
  });
});
