/**
 * Fond « liquid glass ».
 * Quatre nappes floutées orange / bleu, un voile de verre et un grain très
 * léger. Le rendu est identique en clair et en sombre (opacités ajustées par
 * les tokens `--liquid-*` dans `styles/app/theme.css`).
 *
 * Purement décoratif : `aria-hidden` + `pointer-events: none`, donc jamais
 * annoncé ni cliquable. Aucune animation si `prefers-reduced-motion` est actif
 * (règle CSS).
 */
export function LiquidBackground() {
  return (
    <div className="liquid-bg" aria-hidden="true">
      <span className="liquid-blob liquid-blob-1" />
      <span className="liquid-blob liquid-blob-2" />
      <span className="liquid-blob liquid-blob-3" />
      <span className="liquid-blob liquid-blob-4" />
      <span className="liquid-sheen" />
      <span className="liquid-grain" />
    </div>
  );
}
