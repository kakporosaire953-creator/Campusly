/**
 * Lumière ambiante — « Ambient Light Architecture ».
 * ---------------------------------------------------------------------------
 * Un seul élément, `position: fixed`, peint par trois dégradés radiaux et une
 * trame de filets (voir `styles/app/glass.css`). Aucun `filter`, aucun canvas,
 * aucune animation : c'est une image de fond statique, donc sans coût au
 * défilement — ce qui est exactement la contrainte posée pour les appareils
 * de gamme moyenne.
 *
 * Le rendu change avec le thème :
 *
 *  - Editorial Glass (clair) : deux champs très doux, orange chaud et navy,
 *    pour que le papier ne soit pas un aplat mort ;
 *  - Nocturne (sombre) : une chaleur orange basse à gauche, un signal bleu
 *    froid à droite, une lueur rasante en bas de page.
 *
 * `aria-hidden` : c'est un décor, il ne porte aucune information.
 */
export function AmbientLight() {
  return <div className="ambient" aria-hidden="true" data-ambient />;
}
