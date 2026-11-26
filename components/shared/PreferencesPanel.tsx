"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useT, useI18n, changeLocale } from "@/lib/i18n/provider";
import { LOCALE_ORDER, localeConfig, type Locale } from "@/lib/i18n/config";
import { useTheme } from "@/components/shared/theme/ThemeProvider";
import {
  THEME_OPTIONS,
  type ThemePreference,
} from "@/components/shared/theme/config";

/**
 * Panneau de préférences — LE contrôle unique du header.
 * ---------------------------------------------------------------------------
 * Une capsule discrète (« globe + FR ») ouvre deux zones nettement séparées :
 *
 *   LANGUE      sept langues, chacune écrite dans son écriture native
 *   APPARENCE   clair / sombre / automatique
 *
 * Pourquoi un seul panneau : le header ne doit pas se remplir de sept noms de
 * langues et de trois boutons de thème. Un contrôle, deux réglages.
 *
 * Accessibilité : bouton `aria-expanded` + `aria-controls`, panneau `role="dialog"`
 * `aria-modal="false"` (il ne bloque pas la page), navigation par flèches dans
 * chaque groupe (motif `radiogroup`), fermeture par Échap, par clic extérieur.
 * Le focus revient sur la capsule à la fermeture.
 */

type Zone = "language" | "appearance";

export function PreferencesPanel({
  variant = "header",
  onNavigate,
}: {
  variant?: "header" | "menu";
  onNavigate?: () => void;
}) {
  const t = useT();
  const { locale } = useI18n();
  const { preference, setPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const [zone, setZone] = useState<Zone>("language");
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  /* Le portail ne vise `document` qu'après hydratation : jamais au rendu serveur. */
  const [portalReady, setPortalReady] = useState(false);
  const [anchor, setAnchor] = useState<{
    top: number;
    right: number;
    maxHeight: number;
  } | null>(null);

  useEffect(() => setPortalReady(true), []);

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus({ preventScroll: true });
  }, []);

  /* Fermeture : clic extérieur et Échap. Un seul écouteur par panneau. */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      /* Le panneau vit hors du conteneur (portail) : il compte comme intérieur. */
      if (panelRef.current?.contains(target)) return;
      close(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  /* Ancrage mesuré sous la capsule, borné à la fenêtre : en `top: 100%` le
     panneau dépassait le bas de la fenêtre et ses dernières options étaient
     coupées (vérifié). La hauteur maximale est recalculée à chaque
     redimensionnement. */
  useLayoutEffect(() => {
    if (!open || variant !== "header") return;
    const measure = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const gutter = 16;
      const top = rect.bottom + 8;
      setAnchor({
        top,
        right: Math.max(gutter, window.innerWidth - rect.right),
        maxHeight: Math.max(240, window.innerHeight - top - gutter),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, variant]);

  const chooseLocale = (next: Locale) => {
    onNavigate?.();
    if (next === locale) {
      close();
      return;
    }
    changeLocale(next);
  };

  const chooseTheme = (next: ThemePreference) => {
    setPreference(next);
  };

  /* Navigation clavier au sein d'un groupe de boutons radio. */
  const onGroupKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    values: readonly string[],
    current: string,
    select: (value: string) => void,
  ) => {
    const index = values.indexOf(current);
    if (index < 0) return;
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = (index + 1) % values.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = (index - 1 + values.length) % values.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = values.length - 1;
    if (next === null) return;
    event.preventDefault();
    const value = values[next];
    select(value);
    const buttons =
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]");
    buttons[next]?.focus();
  };

  const localeCodes = LOCALE_ORDER as readonly string[];
  const themeValues = THEME_OPTIONS.map((option) => option.value);

  /* Le panneau, monté en portail dans le header (hors du backdrop root de
     la barre) et dans le flux du menu mobile. Une seule définition. */
  const mountedPanel = open ? (
    <div
      id={panelId}
      ref={panelRef}
      className="prefs__panel glass glass--floating"
      role="dialog"
      aria-modal="false"
      aria-label={t("preferences.panelTitle")}
      style={
        variant === "header" && anchor
          ? {
              top: `${anchor.top}px`,
              right: `${anchor.right}px`,
              maxHeight: `${anchor.maxHeight}px`,
            }
          : undefined
      }
    >
      {/* ─────────── LANGUE ─────────── */}
      <section className="prefs__zone" data-zone="language">
        <h2 className="prefs__heading" id={`${panelId}-lang`}>
          {t("preferences.language")}
        </h2>
        <p className="prefs__hint">{t("preferences.languageHint")}</p>
        <div
          className="prefs__options"
          role="radiogroup"
          aria-labelledby={`${panelId}-lang`}
          tabIndex={-1}
          onFocus={() => setZone("language")}
          data-active-zone={zone === "language" ? "true" : undefined}
          onKeyDown={(event) =>
            onGroupKeyDown(event, localeCodes, locale, (value) =>
              chooseLocale(value as Locale),
            )
          }
        >
          {LOCALE_ORDER.map((code) => {
            const config = localeConfig(code);
            const selected = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                className="prefs__option"
                lang={config.bcp47}
                onClick={() => chooseLocale(code)}
              >
                <span className="prefs__option-name">{config.native}</span>
                <span className="prefs__option-meta" aria-hidden="true">
                  {config.short}
                </span>
                {selected ? (
                  <i
                    className="fa-solid fa-check prefs__check"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────── APPARENCE ─────────── */}
      <section className="prefs__zone" data-zone="appearance">
        <h2 className="prefs__heading" id={`${panelId}-theme`}>
          {t("preferences.appearance")}
        </h2>
        <p className="prefs__hint">{t("preferences.appearanceHint")}</p>
        <div
          className="prefs__options prefs__options--theme"
          role="radiogroup"
          aria-labelledby={`${panelId}-theme`}
          tabIndex={-1}
          onFocus={() => setZone("appearance")}
          data-active-zone={zone === "appearance" ? "true" : undefined}
          onKeyDown={(event) =>
            onGroupKeyDown(event, themeValues, preference, (value) =>
              chooseTheme(value as ThemePreference),
            )
          }
        >
          {THEME_OPTIONS.map((option) => {
            const selected = option.value === preference;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                className="prefs__option prefs__option--theme"
                onClick={() => chooseTheme(option.value)}
              >
                <i className={option.icon} aria-hidden="true" />
                <span className="prefs__option-name">{t(option.labelKey)}</span>
                {selected ? (
                  <i
                    className="fa-solid fa-check prefs__check"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  ) : null;

  return (
    <div className={`prefs prefs--${variant}`} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="prefs__trigger glass glass--interactive"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("preferences.open")}
        onClick={() => {
          setOpen((value) => !value);
          setZone("language");
        }}
      >
        <i
          className="fa-solid fa-globe prefs__trigger-icon"
          aria-hidden="true"
        />
        <span className="prefs__trigger-code" aria-hidden="true">
          {localeConfig(locale).short}
        </span>
        <i
          className="fa-solid fa-chevron-down prefs__trigger-chevron"
          aria-hidden="true"
        />
      </button>

      {open && variant === "header" && portalReady
        ? createPortal(mountedPanel, document.body)
        : mountedPanel}
    </div>
  );
}
