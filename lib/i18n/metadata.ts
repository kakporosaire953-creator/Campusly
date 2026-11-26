/**
 * Campusly — métadonnées localisées.
 * ---------------------------------------------------------------------------
 * Chaque page exporte `generateMetadata()` et passe par ce helper : le titre,
 * la description, la langue (`<html lang>` est posé par la racine) et les
 * équivalents linguistiques (`hreflang`) suivent la langue choisie.
 *
 * Les équivalents pointent vers la même URL avec `?lang=…` : les sept versions
 * sont ainsi déclarées aux moteurs sans créer sept arborescences de routes.
 */

import type { Metadata } from "next";
import { getLocale } from "./server";
import { getMessages } from "./dictionaries";
import { LOCALES, localeConfig, type Locale } from "./config";

/** Langue + dictionnaire de la requête, en un seul appel. */
export async function localeContext(): Promise<{ locale: Locale; messages: ReturnType<typeof getMessages> }> {
  const locale = await getLocale();
  return { locale, messages: getMessages(locale) };
}

/**
 * Construit les métadonnées d'une page.
 * @param titleKey clé du titre (`meta.dashboardTitle`…)
 * @param descriptionKey clé de description (facultative)
 * @param path chemin canonique, sans `?lang`
 */
export async function pageMetadata(
  titleKey: keyof ReturnType<typeof getMessages>["meta"],
  path: string,
  descriptionKey?: keyof ReturnType<typeof getMessages>["meta"],
): Promise<Metadata> {
  const { locale, messages } = await localeContext();
  const config = localeConfig(locale);
  const title = messages.meta[titleKey] as string;
  const description = descriptionKey ? (messages.meta[descriptionKey] as string) : messages.meta.homeDescription;

  const languages = Object.fromEntries(
    LOCALES.map((code) => [code, `${path}${path.includes("?") ? "&" : "?"}lang=${code}`]),
  );

  return {
    title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      type: "website",
      locale: config.bcp47,
      title,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}
