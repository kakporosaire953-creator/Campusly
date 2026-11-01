import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { EmptyState, ErrorState, Loader } from "@/components/ui/States";
import { ProgressBar, StatCard } from "@/components/ui/Progress";
import { Modal } from "@/components/ui/Modal";

/**
 * Tests des composants d'interface critiques.
 * Aucun composant ne doit dépendre d'un backend : tout est rendu en mémoire.
 */
describe("Button", () => {
  it("rend un bouton accessible par défaut", () => {
    render(<Button>Valider</Button>);
    const button = screen.getByRole("button", { name: "Valider" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("utilise un lien pour les navigations internes", () => {
    render(<Button href="/dashboard">Mon espace</Button>);
    const link = screen.getByRole("link", { name: "Mon espace" });
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("ajoute rel=noopener pour les liens externes", () => {
    render(<Button href="https://example.com">Externe</Button>);
    expect(screen.getByRole("link", { name: "Externe" })).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("déclenche son action au clic", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Cliquer</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Cliquer" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("Badge", () => {
  it("explicite toujours les données de démonstration", () => {
    render(<DemoBadge />);
    expect(screen.getByText("Données de démonstration")).toBeInTheDocument();
  });

  it("affiche un libellé personnalisé", () => {
    render(<Badge tone="success">Vérifié</Badge>);
    expect(screen.getByText("Vérifié")).toBeInTheDocument();
  });
});

describe("États d'interface", () => {
  it("affiche un état vide avec son action", () => {
    render(<EmptyState title="Aucun résultat" description="Modifiez les filtres." action={<button>Réinitialiser</button>} />);
    expect(screen.getByRole("status")).toHaveTextContent("Aucun résultat");
    expect(screen.getByRole("button", { name: "Réinitialiser" })).toBeInTheDocument();
  });

  it("affiche une erreur avec possibilité de réessayer", async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Service indisponible" onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Service indisponible");
    await userEvent.click(screen.getByRole("button", { name: /réessayer/i }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("expose un rôle status pendant le chargement", () => {
    render(<Loader label="Ouverture…" />);
    expect(screen.getByRole("status")).toHaveTextContent("Ouverture…");
  });
});

describe("ProgressBar & StatCard", () => {
  it("borne la progression et annonce la valeur", () => {
    render(<ProgressBar value={140} label="Progression" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAccessibleName("Progression");
  });

  it("affiche un indicateur statistique lisible", () => {
    render(<StatCard label="Crédits" value={120} icon="fa-solid fa-bolt" tone="orange" hint="Solde fictif" />);
    expect(screen.getByText("Crédits")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("Solde fictif")).toBeInTheDocument();
  });
});

describe("Modal", () => {
  it("ferme au clavier avec Échap", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Confirmation">
        <p>Contenu</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Confirmation");
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("ne rend rien quand elle est fermée", () => {
    render(
      <Modal open={false} onClose={() => undefined} title="Fermé">
        <p>Contenu</p>
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
