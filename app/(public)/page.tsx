import Link from "next/link";
import { HeroPreview } from "@/components/shared/HeroPreview";
import { FaqSection } from "@/components/shared/FaqSection";
import { DEMO_CREDIT_PACKS } from "@/services/mocks/fixtures/credits";

const PILLARS = [
  {
    icon: "fa-solid fa-file-lines",
    tone: "blue" as const,
    title: "Épreuves & Annales",
    description:
      "Retrouvez les anciennes épreuves, partiels et examens classés par faculté, département, semestre et année universitaire.",
    href: "/dashboard/epreuves",
    cta: "Parcourir la bibliothèque",
    color: "var(--brand-1)",
  },
  {
    icon: "fa-solid fa-brain",
    tone: "orange" as const,
    title: "Campusly AI",
    description:
      "Transformez vos cours magistraux, fiches et polycopiés en quiz interactifs et synthèses claires grâce au moteur pédagogique.",
    href: "/dashboard/revision",
    cta: "Essayer Campusly AI",
    color: "var(--accent)",
  },
  {
    icon: "fa-solid fa-layer-group",
    tone: "green" as const,
    title: "5 modes d'apprentissage",
    description:
      "Révisez selon votre profil : QCM chronométré, questions-réponses, vrai/faux express, résumé pédagogique ou marathon adaptatif.",
    href: "/dashboard/revision",
    cta: "Découvrir les modes",
    color: "var(--success)",
  },
  {
    icon: "fa-solid fa-chalkboard-user",
    tone: "blue" as const,
    title: "Classrooms & Amphis",
    description:
      "Les enseignants créent leurs classes, partagent des cours, planifient des devoirs et suivent la réussite des apprenants.",
    href: "/dashboard/classrooms",
    cta: "Espace Classrooms",
    color: "var(--brand-1)",
  },
  {
    icon: "fa-solid fa-stopwatch",
    tone: "orange" as const,
    title: "Compositions surveillées",
    description:
      "Évaluations en ligne avec minuterie stricte, journalisation d'intégrité, correction assistée et validation par l'enseignant.",
    href: "/dashboard/compositions",
    cta: "Salle de composition",
    color: "var(--accent)",
  },
  {
    icon: "fa-solid fa-chart-line",
    tone: "green" as const,
    title: "Diagnostic & Progression",
    description:
      "Identifiez vos points forts et vos lacunes, suivez votre niveau académique et entretenez votre série quotidienne.",
    href: "/dashboard",
    cta: "Voir mon dashboard",
    color: "var(--success)",
  },
];

export default function HomePage() {
  return (
    <>
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="hero" id="hero">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <i className="fa-solid fa-bolt" style={{ color: "var(--accent)" }} aria-hidden="true" /> Nouveau :
                Campusly AI 2.0
              </div>
              <h1 className="hero-title" style={{ marginTop: 12, fontSize: "2.4rem", lineHeight: 1.2 }}>
                <span>La plateforme académique intelligente</span>
                <br />
                <span
                  style={{
                    background: "var(--grad-brand)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  des étudiants et professeurs de l&apos;UAC.
                </span>
              </h1>
              <p
                className="hero-desc"
                style={{ fontSize: "1.02rem", lineHeight: 1.65, color: "var(--text-2)", margin: "18px 0 28px" }}
              >
                Accédez aux anciennes épreuves, révisez avec l&apos;intelligence artificielle, créez des
                évaluations et suivez votre progression.
              </p>

              <div className="hero-cta-row">
                <Link href="/auth?tab=register" className="btn btn-accent btn-lg">
                  Commencer gratuitement <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
                <Link href="#piliers" className="btn btn-ghost btn-lg">
                  Découvrir Campusly
                </Link>
              </div>

              <div className="hero-pillars">
                <PillarChip
                  icon="fa-solid fa-book-open"
                  color="var(--brand-1)"
                  background="rgba(21,101,192,0.12)"
                  title="Épreuves & Annales"
                  subtitle="Sujets & examens classés"
                />
                <PillarChip
                  icon="fa-solid fa-brain"
                  color="var(--accent)"
                  background="rgba(245,124,0,0.12)"
                  title="Campusly AI"
                  subtitle="Génération de quiz & révision"
                />
                <PillarChip
                  icon="fa-solid fa-chalkboard-user"
                  color="var(--success)"
                  background="rgba(16,185,129,0.12)"
                  title="Classrooms Amphi"
                  subtitle="Espace professeurs & devoirs"
                />
              </div>
            </div>

            <div className="hero-visual">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* ─────────────────────── PILIERS ─────────────────────── */}
        <section className="section" id="piliers">
          <div className="section-center">
            <span className="section-tag">Une plateforme, six piliers</span>
            <h2 className="section-title">
              Tout votre parcours <span>académique</span>
            </h2>
            <p className="section-desc">
              Des outils pensés pour les amphis de l&apos;UAC : épreuves, IA pédagogique, classrooms,
              compositions et progression.
            </p>
          </div>

          <div
            className="features-grid"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              gap: 24,
              padding: "0 5%",
            }}
          >
            {PILLARS.map((pillar) => (
              <article className="pillar-card" key={pillar.title}>
                <div
                  className={`feature-icon ${pillar.tone}`}
                  aria-hidden="true"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    marginBottom: 16,
                  }}
                >
                  <i className={pillar.icon} />
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: 16 }}>
                  {pillar.description}
                </p>
                <Link
                  href={pillar.href}
                  style={{
                    marginTop: "auto",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: pillar.color,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {pillar.cta} <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ────────────────────── CAMPUSLY AI ──────────────────── */}
        <section className="section" id="campusly-ai" style={{ padding: "70px 5%", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40, alignItems: "center" }}>
            <div>
              <span className="section-tag">Moteur pédagogique intelligent</span>
              <h2
                style={{
                  fontSize: "clamp(2rem,4vw,2.4rem)",
                  fontWeight: 900,
                  color: "var(--text-1)",
                  margin: "12px 0 16px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                Vos cours deviennent <span style={{ color: "var(--brand-1)" }}>interactifs.</span>
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--text-2)", lineHeight: 1.7, marginBottom: 24 }}>
                Importez vos documents de cours (PDF, fiches, notes manuscrites ou texte brut). Campusly AI
                extrait la structure conceptuelle et génère des entraînements fidèles à vos exigences
                universitaires.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {[
                  ["Importer un document", "cours magistral, TD ou épreuve"],
                  ["Analyse sémantique", "détection automatique des concepts clés"],
                  ["Génération multi-formats", "QCM, Vrai/Faux, questions ouvertes"],
                  ["Relire et personnaliser", "avant de lancer l'entraînement"],
                ].map(([title, detail], index) => (
                  <div key={title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "var(--grad-brand)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </div>
                    <div style={{ fontSize: "0.88rem", color: "var(--text-1)", fontWeight: 600 }}>
                      <strong>{title}</strong> ({detail})
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "rgba(21,101,192,0.08)",
                  border: "1px solid rgba(21,101,192,0.25)",
                  borderRadius: "var(--r-lg)",
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <i className="fa-solid fa-shield-halved" style={{ color: "var(--brand-1)", fontSize: "1.2rem" }} aria-hidden="true" />
                <div style={{ fontSize: "0.82rem", color: "var(--text-1)", lineHeight: 1.4 }}>
                  <strong>L&apos;IA vous assiste. Vous gardez le contrôle.</strong>
                  <br />
                  <span style={{ color: "var(--text-2)" }}>
                    Vos documents restent privés et ne sont pas publiés sans votre autorisation.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────── PROGRESSION ───────────────────── */}
        <section className="section" id="adaptatif" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="section-center">
            <span className="section-tag">Progression ciblée</span>
            <h2 className="section-title">
              Ne révisez pas tout. Révisez ce <span>que vous devez maîtriser.</span>
            </h2>
            <p className="section-desc">
              Le moteur adaptatif identifie vos lacunes et ajuste la sélection des questions pour maximiser
              votre note d&apos;examen.
            </p>
          </div>

          <div className="grid-3" style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5%" }}>
            {[
              { subject: "Algorithmique & Structures de données", status: "Maîtrisé", value: 88, tone: "success" as const },
              { subject: "Analyse mathématique & calcul intégral", status: "À consolider", value: 52, tone: "accent" as const },
              { subject: "Probabilités & variables aléatoires", status: "Priorité haute", value: 43, tone: "danger" as const },
            ].map((topic) => (
              <div className="card" key={topic.subject}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 10 }}>
                  {topic.subject}
                </div>
                <div className="progress-track" style={{ marginBottom: 8 }}>
                  <div className={`progress-fill is-${topic.tone}`} style={{ width: `${topic.value}%` }} />
                </div>
                <div className="row-between">
                  <span style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>{topic.status}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-2)" }}>{topic.value}%</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/dashboard/revision" className="btn btn-primary btn-lg">
              Démarrer le Marathon adaptatif
            </Link>
          </div>
        </section>

        {/* ───────────────────── PROFESSEURS ───────────────────── */}
        <section className="section" id="professeurs" style={{ padding: "70px 5%", maxWidth: 1200, margin: "0 auto" }}>
          <div className="grid-2">
            <div>
              <span className="section-tag">Espace enseignants</span>
              <h2 className="section-title" style={{ fontSize: "clamp(1.8rem,3.5vw,2.2rem)" }}>
                Pensé aussi pour les <span>professeurs.</span>
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--text-2)", lineHeight: 1.7, margin: "12px 0 20px" }}>
                Campusly devient votre centre de pilotage pédagogique à l&apos;UAC. Créez vos espaces
                d&apos;amphi, partagez vos supports, générez des interrogations et suivez les difficultés de
                vos étudiants avec des alertes automatiques.
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {[
                  "Création de classe instantanée et code d'amphi unique",
                  "Banque d'exercices & quiz générés ou personnalisés",
                  "Tableau de bord d'analyse avec alertes de décrochage",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 10, fontSize: "0.88rem", color: "var(--text-2)" }}>
                    <i className="fa-solid fa-circle-check" style={{ color: "var(--success)", marginTop: 4 }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/classrooms" className="btn btn-primary">
                Découvrir les Classrooms
              </Link>
            </div>

            <div className="hero-card" style={{ animation: "none" }}>
              <div className="row" style={{ marginBottom: 16 }}>
                <span
                  className="user-avatar-circle"
                  style={{ width: 44, height: 44 }}
                  aria-hidden="true"
                >
                  KA
                </span>
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-1)" }}>
                    Dr. Komlan Agboton
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-2)" }}>
                    Enseignant Chercheur — FAST Informatique
                  </div>
                </div>
                <span className="premium-badge" style={{ marginLeft: "auto" }}>
                  <i className="fa-solid fa-circle-check" aria-hidden="true" /> Vérifié
                </span>
              </div>

              <div className="stack" style={{ gap: 10 }}>
                {[
                  { label: "Devoir #2 à rendre", value: "41 / 68", tone: "brand" as const },
                  { label: "Moyenne de l'amphi", value: "14,2 / 20", tone: "success" as const },
                  { label: "Apprenants à surveiller", value: "6", tone: "accent" as const },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--r-md)",
                      background: "var(--surface)",
                      fontSize: "0.84rem",
                    }}
                  >
                    <span style={{ color: "var(--text-2)" }}>{row.label}</span>
                    <strong style={{ color: "var(--text-1)" }}>{row.value}</strong>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 14 }}>
                Aperçu illustratif — données de démonstration.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────────────── COMPOSITIONS ──────────────────── */}
        <section className="section" id="compositions" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="section-center">
            <span className="section-tag">Évaluations à distance</span>
            <h2 className="section-title">
              Évaluez vos apprenants, <span>où qu&apos;ils soient.</span>
            </h2>
            <p className="section-desc">
              Organisez des compositions d&apos;amphi et examens blancs surveillés avec correction assistée,
              barème sur 20 et remise d&apos;une copie personnelle.
            </p>
          </div>

          <div className="grid-4" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 5%" }}>
            {[
              { icon: "fa-regular fa-clock", title: "Durée & chronomètre", text: "Compte à rebours synchronisé avec soumission automatique." },
              { icon: "fa-solid fa-shield-halved", title: "Surveillance", text: "Plein écran requis et journalisation des changements d'onglet." },
              { icon: "fa-solid fa-pen-ruler", title: "Correction assistée", text: "Outils d'aide à la correction avant validation par l'enseignant." },
              { icon: "fa-solid fa-file-invoice", title: "Copie personnelle", text: "Copie corrigée détaillée avec feedback pédagogique." },
            ].map((item) => (
              <div className="card" key={item.title}>
                <div className="feature-icon blue" style={{ marginBottom: 12 }} aria-hidden="true">
                  <i className={item.icon} />
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 6 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-2)", lineHeight: 1.55, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/dashboard/compositions" className="btn btn-accent btn-lg">
              Accéder aux Compositions
            </Link>
          </div>
        </section>

        {/* ────────────────── ÉTABLISSEMENTS ───────────────────── */}
        <section className="section" id="etablissements" style={{ padding: "70px 5%", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <span className="section-tag">Enseignement supérieur</span>
          <h2 className="section-title">
            Une plateforme pour vos <span>apprenants.</span>
          </h2>
          <p className="section-desc" style={{ marginBottom: 24 }}>
            Facultés, écoles d&apos;ingénieurs et instituts de l&apos;UAC : déployez Campusly comme
            infrastructure numérique d&apos;apprentissage, d&apos;évaluations et de suivi des promotions.
          </p>
          <Link href="/a-propos#contact" className="btn btn-primary btn-lg">
            Nous contacter
          </Link>
        </section>

        <FaqSection />

        {/* ─────────────────────── TARIFS ──────────────────────── */}
        <section
          className="section pricing-section"
          id="tarifs"
          style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
          <div className="section-center">
            <span className="section-tag">Crédits &amp; Tarifs</span>
            <h2 className="section-title">
              Des packs <span>accessibles à tous</span>
            </h2>
            <p className="section-desc">
              Rechargez vos crédits selon vos besoins d&apos;étude. Le paiement se fait via Mobile Money ou
              carte bancaire (FedaPay) — indisponible dans cette version de démonstration.
            </p>
          </div>

          <div className="pricing-grid">
            {DEMO_CREDIT_PACKS.map((pack, index) => (
              <div className={`pricing-card ${pack.popular ? "popular" : ""}`} key={pack.id}>
                {pack.popular ? <div className="popular-badge">Recommandé</div> : null}
                <div className="pricing-duration">Pack {pack.label}</div>
                <div className="pricing-price">
                  {pack.priceXof.toLocaleString("fr-FR")} <span>FCFA</span>
                </div>
                <ul className="pricing-features">
                  <li>
                    <span className="check">
                      <i className="fa-solid fa-check" aria-hidden="true" />
                    </span>{" "}
                    <strong>{pack.credits} Campusly Credits</strong>
                  </li>
                  <li>
                    <span className="check">
                      <i className="fa-solid fa-check" aria-hidden="true" />
                    </span>{" "}
                    {Math.floor(pack.credits / 25)} analyses de polycopiés
                  </li>
                  <li>
                    <span className="check">
                      <i className="fa-solid fa-check" aria-hidden="true" />
                    </span>{" "}
                    Accès aux 5 modes d&apos;apprentissage
                  </li>
                  <li>
                    <span className="check">
                      <i className="fa-solid fa-check" aria-hidden="true" />
                    </span>{" "}
                    Accès aux épreuves et annales UAC
                  </li>
                </ul>
                <Link href="/dashboard/credits" className={`btn ${index === 1 ? "btn-primary" : "btn-outline"}`} style={{ width: "100%" }}>
                  Voir dans mon espace
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ───────────────────────── CTA ───────────────────────── */}
        <section className="cta-section">
          <h2 className="cta-title">Prêt à réussir votre semestre ?</h2>
          <p className="cta-desc">
            Rejoignez la plateforme académique de l&apos;UAC et transformez vos révisions en résultats.
          </p>
          <div className="cta-actions">
            <Link href="/auth?tab=register" className="btn btn-primary btn-lg">
              Créer mon compte
            </Link>
            <Link href="/dashboard" className="btn btn-ghost btn-lg">
              Explorer la démonstration
            </Link>
          </div>
        </section>
    </>
  );
}

function PillarChip({
  icon,
  color,
  background,
  title,
  subtitle,
}: {
  icon: string;
  color: string;
  background: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="hero-pillar">
      <div className="hero-pillar-icon" style={{ background, color }} aria-hidden="true">
        <i className={icon} />
      </div>
      <div>
        <div className="hero-pillar-title">{title}</div>
        <div className="hero-pillar-sub">{subtitle}</div>
      </div>
    </div>
  );
}
