import { getMessages } from "@/lib/i18n/dictionaries";
import { localeContext } from "@/lib/i18n/metadata";

/** Écran de chargement global — dans la langue de la requête. */
export default async function GlobalLoading() {
  const { locale } = await localeContext();

  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }} role="status" aria-live="polite">
      <div style={{ textAlign: "center", color: "var(--text-2)", fontSize: "0.9rem" }}>
        <span className="loader-spinner" style={{ display: "inline-block", marginBottom: 12 }} aria-hidden="true" />
        <div>{getMessages(locale).common.pageLoading}</div>
      </div>
    </div>
  );
}
