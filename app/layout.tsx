import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/components/shared/AppProviders";
import { LegacyServiceWorkerCleanup } from "@/components/shared/LegacyServiceWorkerCleanup";
import { AmbientLight } from "@/components/shared/AmbientLight";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/shared/theme/ThemeProvider";
import { themeInitScript } from "@/components/shared/theme/config";
import { I18nProvider } from "@/lib/i18n/provider";
import { getLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/dictionaries";
import { localeConfig } from "@/lib/i18n/config";

/**
 * Racine de l'application.
 * ---------------------------------------------------------------------------
 * Deux préférences y sont résolues pour la requête :
 *
 *  - l'APPARENCE (clair / sombre / automatique) est appliquée par un script
 *    inline dans `<head>`, avant toute peinture : aucun flash de thème ;
 *  - la LANGUE est lue dans un cookie côté serveur, donc `<html lang>`, les
 *    métadonnées et le contenu sont déjà dans la bonne langue dans la première
 *    réponse HTTP.
 *
 * Les deux sont indépendantes : changer l'une ne touche jamais l'autre.
 */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const config = localeConfig(locale);

  return {
    metadataBase: new URL("https://campusly-one.vercel.app"),
    title: {
      default: messages.meta.homeTitle,
      template: messages.meta.titleTemplate,
    },
    description: messages.meta.homeDescription,
    applicationName: siteConfig.name,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
      shortcut: ["/favicon.ico"],
    },
    openGraph: {
      type: "website",
      locale: config.bcp47,
      title: messages.meta.homeTitle,
      description: messages.meta.homeDescription,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: messages.meta.homeTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.meta.homeTitle,
      description: messages.meta.homeDescription,
      images: ["/og-image.png"],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* Deux valeurs, pour que la barre du navigateur suive les deux
     environnements : Editorial Glass (ivoire) et Nocturne (deep space). */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1E9" },
    { media: "(prefers-color-scheme: dark)", color: "#071521" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const config = localeConfig(locale);

  return (
    <html
      lang={config.bcp47}
      dir={config.dir}
      className="theme-light"
      data-theme="light"
      data-theme-pref="system"
      suppressHydrationWarning
      /* Le fon et le yoruba reposent sur des diacritiques que les fontes de
         marque ne couvrent pas toutes ; le chinois suppose une pile CJK.
         On déclare donc la police de secours sur la racine plutôt que de
         charger plusieurs mégaoctets de fontes supplémentaires. */
      style={config.fontFallback ? ({ "--brand-locale-fallback": config.fontFallback } as React.CSSProperties) : undefined}
    >
      <head>
        {/* Apparence appliquée avant le premier rendu : aucun flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Marqueur « JavaScript disponible » : les éléments animés à
            l'apparition ne sont masqués que si le script peut les révéler.
            Sans JavaScript, la page reste entièrement lisible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* Polices auto-hébergées : préchargées plutôt que tirées d'un CDN. */}
        <link rel="preload" href="/fonts/brand/baloo-2-latin-700-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/brand/manrope-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <LegacyServiceWorkerCleanup />
        <a className="skip-link" href="#contenu">
          {messages.common.skipToContent}
        </a>
        {/* Lumière ambiante : un seul élément fixe, peint par trois dégradés
            et une trame. Statique — donc gratuite au défilement. */}
        <AmbientLight />
        <ThemeProvider>
          <I18nProvider locale={locale} messages={messages}>
            <AppProviders>{children}</AppProviders>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
