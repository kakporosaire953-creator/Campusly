export const metadata = {
  title: "Campusly — Épreuves, IA & Évaluations UAC",
  description:
    "La plateforme académique intelligente des étudiants et professeurs de l’UAC. Épreuves, Campusly AI, Classrooms, Compositions et Progression.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="theme-light">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link rel="stylesheet" href="/css/modern.css" />
        <link rel="stylesheet" href="/css/theme-light.css" />
        <link rel="stylesheet" href="/css/enhancements.css" />
        <link rel="stylesheet" href="/css/responsive-scale.css" />
        <link rel="stylesheet" href="/css/mobile.css?v=3" />
      </head>
      <body>{children}</body>
    </html>
  );
}
