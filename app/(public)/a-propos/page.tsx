import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { FACULTIES } from "@/types";

export const metadata: Metadata = {
  title: "À propos",
  description: "La mission de Campusly : centraliser les ressources académiques de l'UAC.",
};

/** Les fonctions réellement disponibles, sans les annonces en préparation. */
const OFFERS = [
  "Les annales classées par faculté, département, niveau et année.",
  "Un espace de cours par matière, ouvert par un code d'amphi.",
  "Des entraînements corrigés localement, avec les notions à revoir.",
];

export default function AboutPage() {
  return (
    <div className="doc">
      <div className="ed-rail">
        <header className="doc__head">
          <p className="ed-eyebrow">Le projet</p>
          <h1 className="ed-display doc__title">
            À propos <em>de Campusly.</em>
          </h1>
          <p className="ed-lede doc__lede">
            Centraliser les ressources académiques de l&apos;UAC, et les rendre utilisables
            depuis un seul endroit.
          </p>
        </header>

        <div className="doc__body">
          <section>
            <h2>Pourquoi</h2>
            <p>
              Les épreuves, les supports de cours et les corrections existent déjà : ils circulent
              dans des groupes de messagerie, sur des clés USB et dans des dossiers partagés qui
              finissent par se perdre. Campusly les range selon la logique des maquettes de
              l&apos;université, pour qu&apos;un étudiant de première année trouve la même chose
              qu&apos;un étudiant de cinquième.
            </p>
          </section>

          <section>
            <h2>Ce que la plateforme fait aujourd&apos;hui</h2>
            <ul>
              {OFFERS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Facultés couvertes</h2>
            <p className="doc__faculties">
              {FACULTIES.map((faculty) => (
                <span key={faculty.code}>{faculty.code}</span>
              ))}
            </p>
          </section>

          <section id="demonstration">
            <h2>État actuel : préfiguration</h2>
            <p>
              Cette version présente l&apos;interface complète avec des données fictives. Rien
              n&apos;est enregistré sur un serveur. La génération de questions n&apos;est pas
              ouverte, aucun paiement n&apos;est accepté, et la bibliothèque ouvrira avec ses
              premiers fichiers.
            </p>
          </section>

          <section id="contact">
            <h2>Contact</h2>
            <p>
              Une question, une suggestion, un partenariat d&apos;établissement&nbsp;: écrivez à{" "}
              <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> ou passez
              par la page <Link href="/contribuer">Contribuer</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
