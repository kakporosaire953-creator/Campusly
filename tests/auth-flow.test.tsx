import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * Accès aux pages de l'espace connecté.
 *
 * Ces tests couvrent une régression constatée en production : après une
 * déconnexion explicite, `getSession()` renvoyait `null` définitivement et
 * toutes les pages de l'espace renvoyaient vers /auth. Le bouton
 * « Explorer sans compte » pointait lui-même vers /dashboard, donc rebondissait
 * aussitôt vers /auth : le visiteur restait bloqué sur la page de connexion.
 */

const replace = vi.fn();
const push = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push, refresh: vi.fn(), back: vi.fn(), forward: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/dashboard/epreuves",
  useSearchParams: () => searchParams,
}));

const { authService, startDemoSession } = await import("@/services/authService");
const { SessionProvider } = await import("@/features/auth/SessionProvider");
const { AppShell } = await import("@/components/layout/AppShell");
const { AuthForms } = await import("@/features/auth/AuthForms");
const { ToastProvider } = await import("@/components/ui/ToastProvider");

function renderShell() {
  return render(
    <ToastProvider>
      <SessionProvider>
        <AppShell>contenu de la page</AppShell>
      </SessionProvider>
    </ToastProvider>,
  );
}

function renderAuth() {
  return render(
    <ToastProvider>
      <SessionProvider>
        <AuthForms />
      </SessionProvider>
    </ToastProvider>,
  );
}

describe("session de démonstration", () => {
  beforeEach(() => {
    window.localStorage.clear();
    replace.mockClear();
    push.mockClear();
    searchParams = new URLSearchParams();
  });

  it("renvoie vers /auth en conservant la page demandée", async () => {
    await authService.logout();
    renderShell();

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(`/auth?next=${encodeURIComponent("/dashboard/epreuves")}`),
    );
  });

  it("permet de reprendre une session après une déconnexion explicite", async () => {
    await authService.logout();
    expect(await authService.getSession()).toBeNull();

    const session = await startDemoSession();
    expect(session.user.role).toBe("learner");
    expect((await authService.getSession())?.user.id).toBe(session.user.id);
  });

  it("« Explorer sans compte » rouvre la démonstration au lieu de rebondir sur /auth", async () => {
    await authService.logout();
    searchParams = new URLSearchParams("next=%2Fdashboard%2Fepreuves");
    renderAuth();

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /explorer sans compte/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard/epreuves"));
    expect(await authService.getSession()).not.toBeNull();
  });

  it("ignore une redirection externe fournie dans ?next", async () => {
    await authService.logout();
    searchParams = new URLSearchParams("next=https%3A%2F%2Fevil.example");
    renderAuth();

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /explorer sans compte/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
  });

  it("le bandeau de démonstration est au-dessus du layout, pas dans la rangée sidebar/contenu", () => {
    renderShell();

    const banner = screen.getByRole("note");
    const layout = document.querySelector(".app-layout");
    const shell = document.querySelector(".app-shell");

    expect(shell).not.toBeNull();
    expect(layout).not.toBeNull();
    // Le bandeau ne doit pas être un enfant du flex row `.app-layout` :
    // sinon il partage la largeur avec la sidebar et écrase le contenu.
    expect(layout?.contains(banner)).toBe(false);
    expect(banner.parentElement).toBe(shell);
    expect(layout?.parentElement).toBe(shell);
  });

  it("le bouton hamburger ouvre réellement le menu de navigation (tablette / mobile)", async () => {
    renderShell();

    const toggle = await screen.findByRole("button", { name: /ouvrir la navigation/i });
    const sidebar = document.getElementById("appSidebar");
    expect(sidebar).not.toBeNull();
    expect(sidebar).not.toHaveClass("open");

    const user = userEvent.setup();
    await user.click(toggle);

    // `.open` pilote le composant, `.show` est la classe attendue par la
    // feuille historique : les deux doivent être présentes pour que le menu
    // s'affiche sur tablette et mobile.
    expect(sidebar).toHaveClass("open");
    expect(sidebar).toHaveClass("show");
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: /fermer le menu/i }));
    expect(sidebar).not.toHaveClass("open");
  });

  it("affiche un message « connexion requise » quand une page est demandée", async () => {
    await authService.logout();
    searchParams = new URLSearchParams("next=%2Fadmin");
    renderAuth();

    // Le <div role="status"> de la zone de notification existe aussi : on cible le texte.
    expect(await screen.findByText(/connexion requise/i)).toBeInTheDocument();
  });
});
