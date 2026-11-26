import Link from "next/link";
import { Logo } from "@/components/shared/CampuslyLogo";
import { getMessages } from "@/lib/i18n/dictionaries";
import { localeContext } from "@/lib/i18n/metadata";
import "@/styles/legacy/pages/offline.css";

export async function generateMetadata() {
  const { locale } = await localeContext();
  return { title: getMessages(locale).pages.system.offlineTitle, robots: { index: false, follow: false } };
}

/**
 * Page de secours hors ligne.
 * Statique côté contenu, mais rendue par requête pour suivre la langue
 * (cookie) : un utilisateur hors ligne voit cette page dans SA langue, pas en
 * français. Elle pourra être mise en cache par un service worker lorsque le
 * mode PWA sera réactivé (voir docs/FRONTEND_GUIDE.md).
 */
export default async function OfflinePage() {
  const { locale } = await localeContext();
  const s = getMessages(locale).pages.system;

  return (
    <div className="offline-page" id="contenu">
      <div className="offline-container">
        <div className="logo-brand">
          <Logo size={30} />
        </div>
        <div className="offline-icon" aria-hidden="true">
          <i className="fa-solid fa-wifi" />
        </div>
        <h1>{s.offlineTitle}</h1>
        <p>{s.offlineBody}</p>
        <Link href="/dashboard" className="btn btn-primary">
          <i className="fa-solid fa-rotate-right" aria-hidden="true" /> {s.retry}
        </Link>
        <div className="tips">
          <h3>
            <i className="fa-solid fa-lightbulb" aria-hidden="true" style={{ color: "var(--brand-orange)" }} />{" "}
            {s.offlineTips}
          </h3>
          <ul>
            <li>
              <i className="fa-solid fa-check" aria-hidden="true" /> {s.offlineTip1}
            </li>
            <li>
              <i className="fa-solid fa-check" aria-hidden="true" /> {s.offlineTip2}
            </li>
            <li>
              <i className="fa-solid fa-check" aria-hidden="true" /> {s.offlineTip3}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
