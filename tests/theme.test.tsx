import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/components/shared/theme/ThemeProvider";
import { THEME_STORAGE_KEY } from "@/components/shared/theme/config";
import { PreferencesPanel } from "@/components/shared/PreferencesPanel";
import { I18nProvider } from "@/lib/i18n/provider";
import { getMessages } from "@/lib/i18n/dictionaries";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import de from "@/messages/de.json";
import zhCN from "@/messages/zh-CN.json";
import fon from "@/messages/fon.json";
import yo from "@/messages/yo.json";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/types";

/**
 * Apparence et langue — les deux préférences doivent rester indépendantes.
 * Vérifie ce qui est réellement exécutable sans navigateur : attributs posés
 * sur <html>, classes historiques maintenues, persistance, et intégrité des
 * sept dictionnaires.
 */

/** `matchMedia` n'existe pas dans jsdom : on simule un système clair. */
function stubMatchMedia(prefersDark = false) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-color-scheme: dark") ? prefersDark : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

function renderPanel(locale: Locale = "fr") {
  return render(
    <ThemeProvider>
      <I18nProvider locale={locale} messages={getMessages(locale)}>
        <PreferencesPanel />
      </I18nProvider>
    </ThemeProvider>,
  );
}

describe("apparence", () => {
  beforeEach(() => {
    stubMatchMedia(false);
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme-pref");
    document.documentElement.classList.remove("theme-light", "theme-dark");
    window.localStorage.clear();
  });

  it("propose les trois préférences et applique le mode sombre", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByRole("button", { name: /préférences de langue et d'apparence/i }));

    const appearance = screen.getByRole("radiogroup", { name: /apparence/i });
    const dark = within(appearance).getByRole("radio", { name: /sombre/i });
    await user.click(dark);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.themePref).toBe("dark");
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
    expect(document.documentElement.classList.contains("theme-light")).toBe(false);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("« automatique » n'écrit rien et suit le système", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    renderPanel();

    await user.click(screen.getByRole("button", { name: /préférences de langue et d'apparence/i }));
    const appearance = screen.getByRole("radiogroup", { name: /apparence/i });
    await user.click(within(appearance).getByRole("radio", { name: /automatique/i }));

    // Système clair → thème clair, et aucune préférence figée dans le stockage.
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.dataset.themePref).toBe("system");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});

describe("langue", () => {
  beforeEach(() => {
    stubMatchMedia(false);
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("affiche les sept langues dans leur écriture native", async () => {
    const user = userEvent.setup();
    renderPanel("fr");

    await user.click(screen.getByRole("button", { name: /préférences de langue et d'apparence/i }));
    const languages = screen.getByRole("radiogroup", { name: /langue/i });
    const radios = within(languages).getAllByRole("radio");

    expect(radios).toHaveLength(7);
    for (const native of ["Français", "English", "Español", "Deutsch", "中文", "Fɔngbè", "Yorùbá"]) {
      expect(within(languages).getAllByText(native).length).toBeGreaterThan(0);
    }
    expect(within(languages).getByRole("radio", { name: /Français/ })).toHaveAttribute("aria-checked", "true");
  });

  it("traduit l'interface dans la langue fournie", async () => {
    const user = userEvent.setup();
    renderPanel("en");

    const trigger = screen.getByRole("button", { name: /language and appearance preferences/i });
    await user.click(trigger);
    expect(screen.getByRole("radiogroup", { name: /^language$/i })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: /appearance/i })).toBeInTheDocument();
  });
});

describe("dictionnaires", () => {
  const dictionaries: Record<Locale, Messages> = {
    fr: fr as Messages,
    en: en as Messages,
    es: es as Messages,
    de: de as Messages,
    "zh-CN": zhCN as Messages,
    fon: fon as Messages,
    yo: yo as Messages,
  };

  const flatten = (value: unknown, prefix = ""): string[] => {
    if (typeof value === "string") return [prefix];
    if (value && typeof value === "object") {
      return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
        flatten(child, prefix ? `${prefix}.${key}` : key),
      );
    }
    return [];
  };

  const reference = new Set(flatten(fr));

  it("les sept langues exposent exactement les mêmes clés", () => {
    for (const [locale, messages] of Object.entries(dictionaries)) {
      const keys = new Set(flatten(messages));
      const missing = [...reference].filter((key) => !keys.has(key));
      const extra = [...keys].filter((key) => !reference.has(key));
      expect(missing, `clés manquantes en ${locale}`).toEqual([]);
      expect(extra, `clés en trop en ${locale}`).toEqual([]);
    }
  });

  it("aucune valeur n'est vide ni laissée en lorem ipsum", () => {
    for (const [locale, messages] of Object.entries(dictionaries)) {
      const values: string[] = [];
      const walk = (value: unknown) => {
        if (typeof value === "string") values.push(value);
        else if (value && typeof value === "object") Object.values(value).forEach(walk);
      };
      walk(messages);
      for (const value of values) {
        expect(value.trim(), `valeur vide en ${locale}`).not.toBe("");
        expect(value.toLowerCase()).not.toContain("lorem ipsum");
      }
    }
  });
});
