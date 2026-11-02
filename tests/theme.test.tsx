import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, THEME_STORAGE_KEY } from "@/components/shared/ThemeProvider";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

/**
 * Bascule clair / sombre.
 * Vérifie le comportement réellement exécutable sans navigateur : attribut
 * `data-theme` sur <html>, classe historique `theme-light` maintenue, et
 * persistance de la préférence dans le stockage local.
 */
describe("thème clair / sombre", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("theme-light", "theme-dark");
    window.localStorage.clear();
  });

  it("applique le thème sombre puis revient au clair", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole("button", { name: /thème sombre/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
    expect(document.documentElement.classList.contains("theme-light")).toBe(false);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    const back = screen.getByRole("button", { name: /thème clair/i });
    expect(back).toHaveAttribute("aria-pressed", "true");

    await user.click(back);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.classList.contains("theme-light")).toBe(true);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("reprend la préférence enregistrée", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(await screen.findByRole("button", { name: /thème clair/i })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
