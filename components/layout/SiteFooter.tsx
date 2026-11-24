import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { LogoCap } from "@/components/layout/SiteHeader";

/**
 * Colophon — la dernière page du journal.
 * ---------------------------------------------------------------------------
 * Trois blocs, pas quatre : la marque, les trois familles de liens utiles
 * (« Campusly », « Plateforme », « Ressources et informations »), puis les
 * mentions légales. L'appel aux établissements reste en tête du colophon.
 *
 * Aucune destination n'a été supprimée : « Fonctionnalités » et
 * « Institutions » de l'ancien pied de page sont repliées dans les trois
 * familles, et les conditions d'utilisation y figurent désormais en clair.
 * Campusly y est présenté pour ce qu'il est : un projet indépendant, sans
 * adossement officiel à l'UAC.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__institutional">
        <div className="site-footer__institutional-text" data-reveal>
          <p className="site-footer__eyebrow">Établissements et partenaires</p>
          <h2 className="site-footer__title">
            Et si nous faisions évoluer l&apos;expérience universitaire ensemble&nbsp;?
          </h2>
          <p className="site-footer__desc">
            Vous représentez un établissement d&apos;enseignement supérieur, une faculté ou une
            structure pédagogique&nbsp;? Découvrons comment Campusly pourrait répondre à vos besoins.
          </p>
        </div>
        <div className="site-footer__institutional-actions" data-reveal>
          <Link href="/a-propos#contact" className="btn">
            Demander une démonstration
          </Link>
          <Link href="/a-propos#contact" className="btn btn-outline">
            Proposer un partenariat
          </Link>
        </div>
      </div>

      <div className="site-footer__main">
        <div className="site-footer__brand" data-reveal>
          <Link href="/" className="site-nav__logo" aria-label="Campusly — accueil">
            <span className="logo-text">
              <span className="logo-cap" aria-hidden="true">
                <LogoCap />
              </span>
              <span className="logo-campus">Campus</span>
              <span className="logo-ly">ly</span>
            </span>
          </Link>
          <p>
            Ressources académiques, espaces de cours et outils de révision pensés pour les étudiants
            et les enseignants de l&apos;UAC.
          </p>
          <p className="site-footer__claim">
            Projet indépendant. Campusly n&apos;est ni édité ni approuvé officiellement par
            l&apos;Université d&apos;Abomey-Calavi.
          </p>
          <p className="site-footer__meta">
            Bénin · {siteConfig.version} · Préfiguration
          </p>
        </div>

        {footerNav.map((group) => (
          <nav className="site-footer__col" key={group.title} aria-label={group.title} data-reveal>
            <h3>{group.title}</h3>
            {group.links.map((link) => (
              <Link key={`${group.title}-${link.label}`} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 Campusly — Bénin</p>
        <div className="site-footer__legal">
          <Link href="/politique-de-confidentialite">Confidentialité</Link>
          <Link href="/conditions">Conditions d&apos;utilisation</Link>
          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
