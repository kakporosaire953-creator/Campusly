import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/components/shared/AppProviders";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://campusly-one.vercel.app"),
  title: {
    default: "Campusly — Épreuves, IA & Évaluations UAC",
    template: "%s — Campusly",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    title: "Campusly — Plateforme Académique Intelligente UAC",
    description: siteConfig.description,
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1565C0",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="theme-light">
      <body>
        {/* Polices et icônes : mêmes CDN que la version historique (identité conservée). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <a className="skip-link" href="#contenu">
          Aller au contenu principal
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
