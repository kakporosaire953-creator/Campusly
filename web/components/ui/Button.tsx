import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconAfter?: string;
  block?: boolean;
  children?: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  "aria-label"?: string;
};

/**
 * Bouton de l'identité Campusly.
 * Réutilise strictement `.btn` + variantes définies dans modern.css, avec un
 * rendu `button` ou `Link` pour garantir l'accessibilité clavier
 * (l'ancien code utilisait des `<div onclick>`).
 */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", icon, iconAfter, block, children, className = "" } = props;
  const classes = [
    "btn",
    `btn-${variant}`,
    size !== "md" ? `btn-${size}` : "",
    block ? "btn-block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const { href, onClick, ...rest } = props as ButtonAsLink;
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          aria-label={(props as ButtonAsLink)["aria-label"]}
          rel="noopener noreferrer"
          {...rest}
        >
          {icon ? <i className={icon} aria-hidden="true" /> : null}
          {children}
          {iconAfter ? <i className={iconAfter} aria-hidden="true" /> : null}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick} aria-label={(props as ButtonAsLink)["aria-label"]}>
        {icon ? <i className={icon} aria-hidden="true" /> : null}
        {children}
        {iconAfter ? <i className={iconAfter} aria-hidden="true" /> : null}
      </Link>
    );
  }

  const {
    variant: _variant,
    size: _size,
    icon: _icon,
    iconAfter: _iconAfter,
    block: _block,
    className: _className,
    ...buttonProps
  } = props as ButtonAsButton;

  return (
    <button type="button" className={classes} {...buttonProps}>
      {icon ? <i className={icon} aria-hidden="true" /> : null}
      {children}
      {iconAfter ? <i className={iconAfter} aria-hidden="true" /> : null}
    </button>
  );
}
