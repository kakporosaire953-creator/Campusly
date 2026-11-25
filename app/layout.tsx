import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/components/shared/AppProviders";
import { LegacyServiceWorkerCleanup } from "@/components/shared/LegacyServiceWorkerCleanup";
import { siteConfig } from "@/config/site";
import { ThemeProvider, themeInitScript } from "@/components/shared/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://campusly-one.vercel.app"),
  title: {
    default: "Campusly — Apprendre avec une longueur d'avance",
    template: "%s — Campusly",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    title: "Campusly — Apprendre avec une longueur d'avance",
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Campusly — ressources, cours et révisions pour l'université",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Campusly — Apprendre avec une longueur d'avance",
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F1E9",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="theme-light" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Thème appliqué avant le premier rendu : aucun flash clair/sombre. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Marqueur « JavaScript disponible » : les éléments animés à
            l'apparition ne sont masqués que si le script peut les révéler.
            Sans JavaScript, la page reste entièrement lisible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* Polices et icônes : mêmes CDN que la version historique (identité
            conservée). Placées dans <head> pour ne pas retarder le rendu du
            body et pour rester valides au regard de la spécification HTML. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap"
        />
      </head>
      <body>
        <LegacyServiceWorkerCleanup />
        <a className="skip-link" href="#contenu">
          Aller au contenu principal
        </a>
        {/* Le fond « liquide » (quatre nappes floues animées) a été retiré :
            il ne restait qu'un halo bleu et orange derrière l'application, en
            contradiction avec les surfaces planes du reste du site.
            `components/shared/LiquidBackground.tsx` est conservé pour mémoire
            mais n'est plus monté. */}
        <ThemeProvider>
          <AppProviders>{children}</AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
