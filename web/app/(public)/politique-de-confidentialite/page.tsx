import type { Metadata } from "next";
import "@/styles/legacy/pages/politique.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Données collectées, finalités et droits des utilisateurs Campusly.",
};

export default function PrivacyPage() {
  return (
    <main className="policy-main">
      <h1 className="policy-title">Politique de confidentialité</h1>
      <div className="policy-content">
        <p>Dernière mise à jour : novembre 2026</p>

        <h2>1. Données collectées</h2>
        <p>Campusly collecte les informations suivantes lors de votre inscription et de l&apos;utilisation du service :</p>
        <ul>
          <li>
            <strong>Informations d&apos;identité :</strong> nom, prénom, adresse e-mail.
          </li>
          <li>
            <strong>Informations académiques :</strong> matricule UAC, faculté et département d&apos;appartenance.
          </li>
          <li>
            <strong>Données d&apos;utilisation :</strong> historique de quiz, progression, épreuves consultées et
            messages du forum.
          </li>
        </ul>

        <h2>2. Utilisation de vos données</h2>
        <p>Vos données sont exclusivement utilisées pour :</p>
        <ul>
          <li>Personnaliser votre expérience (suggestions d&apos;épreuves de votre faculté).</li>
          <li>Suivre votre progression académique dans le tableau de bord.</li>
          <li>Gérer votre abonnement et les paiements via notre partenaire FedaPay.</li>
        </ul>

        <h2>3. Protection et sécurité</h2>
        <p>
          Les mots de passe sont hachés côté serveur. Aucune donnée personnelle n&apos;est revendue. Dans cette
          version de démonstration, <strong>aucune donnée ne quitte votre navigateur</strong> : les informations
          saisies restent dans le stockage local et peuvent être effacées à tout moment depuis les paramètres.
        </p>

        <h2>4. Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. La
          suppression du compte sera disponible depuis les paramètres du tableau de bord.
        </p>

        <h2>5. Nous contacter</h2>
        <p>
          Pour toute question concernant vos données, écrivez à{" "}
          <a href={`mailto:${siteConfig.supportEmail}`} style={{ color: "var(--brand-1)" }}>
            {siteConfig.supportEmail}
          </a>{" "}
          ou via WhatsApp au {siteConfig.whatsapp}.
        </p>
      </div>
    </main>
  );
}
