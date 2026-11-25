import type { ReactNode } from "react";

/** Carte de base — reprend `.card` de modern.css. */
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return <Tag className={`card ${className}`.trim()}>{children}</Tag>;
}

/**
 * En-tête de carte : titre, précision, action éventuelle.
 *
 * L'icône optionnelle est conservée dans la signature pour ne pas modifier les
 * appels existants, mais elle n'est plus affichée : la pastille bleue qui la
 * portait restait un carré vide partout où la police d'icônes n'était pas
 * chargée, et n'apportait aucune information que le titre ne donne déjà.
 */
export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card-head">
      <div className="card-head__text">
        <h3 className="card-title">{title}</h3>
        {subtitle ? <p className="card-head__sub">{subtitle}</p> : null}
      </div>
      {action ? <div className="card-head__action">{action}</div> : null}
    </div>
  );
}
