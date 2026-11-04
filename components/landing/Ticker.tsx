/**
 * Bande défilante éditoriale.
 * ---------------------------------------------------------------------------
 * Deux copies de la même suite, animées en translation continue par CSS : le
 * moteur GSAP principal reste libre. Purement décoratif (`aria-hidden`), et
 * figé si `prefers-reduced-motion` est actif. Le contenu ne cite que des
 * fonctions réellement présentes dans l'application.
 */
const ITEMS = [
  "Épreuves classées par maquette",
  "Fiches de révision",
  "Amphis avec code",
  "Compositions chronométrées",
  "Ressources libres",
  "Correction relue par l'enseignant",
];

export function Ticker({ inverted = false }: { inverted?: boolean }) {
  const suite = [...ITEMS, ...ITEMS];

  return (
    <div className={`ticker ${inverted ? "is-inverted" : ""}`} aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <span className="ticker-suite" key={copy}>
            {suite.map((item, index) => (
              <span className="ticker-item" key={`${copy}-${index}`}>
                {item}
                <span className="ticker-star">✶</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
