import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/CampuslyLogo";
import { localeContext } from "@/lib/i18n/metadata";
import type { MessageKey } from "@/lib/i18n/types";

/**
 * Colophon — la dernière page du journal.
 * ---------------------------------------------------------------------------
 * Trois blocs : la marque, les trois familles de liens utiles, puis les
 * mentions légales. L'appel aux établissements reste en tête.
 *
 * Aucune destination n'a été supprimée : « Fonctionnalités » et
 * « Institutions » sont repliées dans les trois familles, et les conditions
 * d'utilisation y figurent en clair. Campusly y est présenté pour ce qu'il
 * est : un projet indépendant, sans adossement officiel à l'UAC.
 *
 * Les libellés viennent des dictionnaires ; `footerNav` ne porte que les
 * clés et les destinations.
 */
export async function SiteFooter() {
  const { messages, locale } = await localeContext();
  const t = messages;

  return (
    <footer className="site-footer">
      <div className="site-footer__institutional">
        <div className="site-footer__institutional-text" data-reveal>
          <p className="site-footer__eyebrow">{t.footer.institutionsEyebrow}</p>
          <h2 className="site-footer__title">{t.footer.institutionsTitle}</h2>
          <p className="site-footer__desc">{t.footer.institutionsText}</p>
        </div>
        <div className="site-footer__institutional-actions" data-reveal>
          <Link href="/a-propos#contact" className="btn">
            {t.footer.demoCta}
          </Link>
          <Link href="/a-propos#contact" className="btn btn-outline">
            {t.footer.partnerCta}
          </Link>
        </div>
      </div>

      <div className="site-footer__main">
        <div className="site-footer__brand" data-reveal>
          <Link href="/" className="site-nav__logo" aria-label={t.nav.homeLabel}>
            <Logo size={30} className="logo-campusly" />
          </Link>
          <p>{t.footer.brandText}</p>
          <p className="site-footer__claim">{t.footer.claim}</p>
          <p className="site-footer__meta">{t.footer.meta.replace("{version}", siteConfig.version)}</p>
        </div>

        {footerNav.map((group) => {
          const groupTitle = t.footer[group.titleKey.split(".")[1] as keyof typeof t.footer];
          return (
            <nav className="site-footer__col" key={group.titleKey} aria-label={groupTitle as string} data-reveal>
              <h3>{groupTitle as string}</h3>
              {group.links.map((link) => (
                <Link key={`${group.titleKey}-${link.href}`} href={link.href}>
                  {t.footer[link.labelKey.split(".")[1] as keyof typeof t.footer] as string}
                </Link>
              ))}
            </nav>
          );
        })}
      </div>

      <div className="site-footer__bottom">
        <p>{t.footer.base}</p>
        <div className="site-footer__legal">
          <Link href="/politique-de-confidentialite">{t.footer.privacy}</Link>
          <Link href="/conditions">{t.footer.terms}</Link>
          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.footer.support}
          </a>
        </div>
      </div>
    </footer>
  );
}
