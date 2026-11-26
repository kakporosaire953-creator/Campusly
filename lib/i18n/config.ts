/**
 * Campusly — configuration des langues.
 * ---------------------------------------------------------------------------
 * Sept langues d'interface, le français par défaut.
 *
 * Choix d'architecture : **aucun préfixe d'URL**. La langue est une
 * préférence (cookie + `localStorage`), exactement comme l'apparence. Aucune
 * URL existante ne change, aucune arborescence `app/` n'est dupliquée. Le
 * rendu lit la langue côté serveur, donc `<html lang>`, `<title>` et les
 * `meta` sont corrects dès la première réponse HTTP (pas de mélange de
 * langues, pas de flash).
 *
 * Le prix assumé : les pages dépendent du cookie, donc du rendu dynamique.
 * Les équivalents linguistiques sont déclarés en `hreflang` (voir
 * `lib/i18n/metadata.ts`) pour rester indexables.
 */

export const LOCALES = ["fr", "en", "es", "de", "zh-CN", "fon", "yo"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

/** Cookie qui porte la préférence, lu au rendu serveur. */
export const LOCALE_COOKIE = "campusly.lang";

/** Durée de vie du cookie (un an). */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export interface LocaleConfig {
  code: Locale;
  /** Nom de la langue **dans sa propre écriture** — jamais un drapeau :
   *  un drapeau désigne un pays, pas une langue. */
  native: string;
  /** Nom en français, pour les lecteurs d'écran d'une autre langue. */
  french: string;
  /** Code BCP-47 complet, pour `lang`, `hreflang` et `Intl`. */
  bcp47: string;
  /** Sens d'écriture — les sept langues sont latines ou sinographiques (LTR). */
  dir: "ltr" | "rtl";
  /** Abréviation affichée dans la capsule du header (2 à 3 caractères). */
  short: string;
  /** Fuseau et formats : une date doit se lire comme dans la langue. */
  dateLocale: string;
  /** Devise affichée dans l'interface (le montant n'est jamais converti). */
  currency: string;
  /**
   * Pile système ajoutée APRÈS les fontes de secours auto-hébergées.
   * `Baloo 2` et `Manrope` ne portent que le latin de base : le chinois, le
   * fon et le yoruba ont besoin de glyphes qu'ils n'ont pas. Ces glyphes sont
   * fournis par les sous-ensembles `Campusly CJK` et `Campusly Fallback`
   * (voir `styles/app/brand.css`), auto-hébergés et testés. Ce champ ne sert
   * donc qu'à préférer la fonte système de la machine quand elle existe
   * (PingFang sur macOS, Segoe UI sur Windows), pour un rendu plus proche de
   * l'OS — jamais à combler un manque.
   */
  fontFallback?: string;
  /** Vrai si les traductions n'ont pas pu être validées par un locuteur. */
  needsLinguisticReview: boolean;
}

export const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  fr: {
    code: "fr",
    native: "Français",
    french: "Français",
    bcp47: "fr-BJ",
    dir: "ltr",
    short: "FR",
    dateLocale: "fr-FR",
    currency: "XOF",
    needsLinguisticReview: false,
  },
  en: {
    code: "en",
    native: "English",
    french: "Anglais",
    bcp47: "en",
    dir: "ltr",
    short: "EN",
    dateLocale: "en-GB",
    currency: "XOF",
    needsLinguisticReview: false,
  },
  es: {
    code: "es",
    native: "Español",
    french: "Espagnol",
    bcp47: "es",
    dir: "ltr",
    short: "ES",
    dateLocale: "es-ES",
    currency: "XOF",
    needsLinguisticReview: false,
  },
  de: {
    code: "de",
    native: "Deutsch",
    french: "Allemand",
    bcp47: "de",
    dir: "ltr",
    short: "DE",
    dateLocale: "de-DE",
    currency: "XOF",
    needsLinguisticReview: false,
  },
  "zh-CN": {
    code: "zh-CN",
    native: "中文",
    french: "Chinois simplifié",
    bcp47: "zh-CN",
    dir: "ltr",
    short: "中文",
    dateLocale: "zh-CN",
    currency: "XOF",
    /* Les sinogrammes de l'interface sont couverts par le sous-ensemble
       auto-hébergé `Campusly CJK` (393 caractères, 63 Ko). La pile système
       passe ensuite, pour préférer la fonte native de la machine. */
    fontFallback: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif',
    /* Traductions rédigées et relues dans cette passe, sans validation par un
       locuteur natif externe : signalé dans le rapport final. */
    needsLinguisticReview: true,
  },
  fon: {
    code: "fon",
    native: "Fɔngbè",
    french: "Fon",
    bcp47: "fon",
    dir: "ltr",
    short: "FON",
    dateLocale: "fr-FR",
    currency: "XOF",
    /* Le fon s'écrit avec l'alphabet latin étendu (ɖ, ɛ, ɔ, ǔ, ǎ…). Manrope et
       Baloo 2 ne garantissent pas ces graphèmes : on complète par les piles
       système qui les contiennent. */
    fontFallback: '"Noto Sans", "DejaVu Sans", "Segoe UI", sans-serif',
    needsLinguisticReview: true,
  },
  yo: {
    code: "yo",
    native: "Yorùbá",
    french: "Yoruba",
    bcp47: "yo",
    dir: "ltr",
    short: "YO",
    dateLocale: "yo-NG",
    currency: "XOF",
    /* Le yoruba est une langue à tons : á à ẹ ọ ṣ et les tons souscrits
       exigent une couverture Unicode que les fontes de marque n'ont pas. */
    fontFallback: '"Noto Sans", "DejaVu Sans", "Segoe UI", sans-serif',
    needsLinguisticReview: true,
  },
};

/** Ordre d'affichage dans le panneau de préférences. */
export const LOCALE_ORDER: readonly Locale[] = LOCALES;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function localeConfig(locale: Locale): LocaleConfig {
  return LOCALE_CONFIG[locale] ?? LOCALE_CONFIG[DEFAULT_LOCALE];
}
