import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
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
  it("charge les épreuves, filtre par recherche et affiche l'état vide", async () => {
    const user = userEvent.setup();
    withProviders(<ExamLibrary />);

    // Chargement puis résultats
    expect(await screen.findByText(/épreuves? trouvée/i, undefined, { timeout: 4000 })).toBeInTheDocument();
    const search = screen.getByLabelText("Rechercher");

    await user.type(search, "algorithm");
    await waitFor(() => expect(screen.getByText(/épreuves? trouvée/i)).toHaveTextContent(/^[1-9]/), { timeout: 4000 });

    await user.clear(search);
    await user.type(search, "zzzz-inexistant");
    expect(await screen.findByText(/Aucune épreuve ne correspond/i, undefined, { timeout: 4000 })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Réinitialiser les filtres/i }));
    expect(await screen.findByText(/épreuves? trouvée/i, undefined, { timeout: 4000 })).toBeInTheDocument();
  });

  it("ajoute puis retire une épreuve des favoris", async () => {
    const user = userEvent.setup();
    withProviders(<ExamLibrary />);

    // Les fixtures pré-remplissent des favoris : on attend leur hydratation pour
    // éviter de cliquer sur une carte dont l'état va changer.
    await screen.findAllByRole("button", { name: "Retirer des favoris" }, { timeout: 4000 });

    const articles = screen.getAllByRole("article");
    const target = articles.find((article) =>
      within(article).queryByRole("button", { name: "Ajouter aux favoris" }),
    );
    expect(target).toBeDefined();

    const addButton = within(target!).getByRole("button", { name: "Ajouter aux favoris" });
    await user.click(addButton);

    const removeButton = await within(target!).findByRole("button", { name: "Retirer des favoris" });
    expect(removeButton).toHaveAttribute("aria-pressed", "true");

    await user.click(removeButton);
    expect(await within(target!).findByRole("button", { name: "Ajouter aux favoris" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("n'ouvre aucun fichier : le téléchargement est explicitement simulé", async () => {
    const user = userEvent.setup();
    withProviders(<ExamLibrary />);

    const downloads = await screen.findAllByRole("button", { name: /Télécharger /i }, { timeout: 4000 });
    await user.click(downloads[0]);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/Téléchargement simulé/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/Aucun fichier n'est servi/i)).toBeInTheDocument();
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
    expect(screen.getByText(/correction locale de démonstration/i)).toBeInTheDocument();
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
