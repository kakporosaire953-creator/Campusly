/**
 * Titre éditorial à deux voix.
 * ---------------------------------------------------------------------------
 * Les titres de page ont une partie pleine et une partie en orange italique.
 * En français, la coupe tombe sur une espace ; en allemand (« Nutzungs-
 * bedingungen. »), en chinois (pas d'espace du tout) ou en fon, elle tombe au
 * milieu d'un mot. Écrire deux chaînes séparées dans le JSX ajoutait donc une
 * espace parasite au milieu du mot (« Nutzungs bedingungen. »).
 *
 * Ici, une seule phrase complète est stockée, et la portion à mettre en valeur
 * est retrouvée dedans : le rendu découpe exactement, sans rien insérer.
 * Si la portion n'est pas trouvée (traduction modifiée), le titre s'affiche
 * entier plutôt que de disparaître.
 */
export function SplitAccent({ text, accent }: { text: string; accent?: string }) {
  if (!accent) return <>{text}</>;

  const start = text.indexOf(accent);
  if (start < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, start)}
      <em>{accent}</em>
      {text.slice(start + accent.length)}
    </>
  );
}
