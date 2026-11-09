"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  items: string[];
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
  reverse?: boolean;
  /** Durée d'un tour complet, en secondes. */
  speed?: number;
};

/**
 * Bandeau défilant infini — animation reprise du site Kraken.
 * Deux rangées identiques : la seconde est masquée aux technologies
 * d'assistance, et la piste revient exactement à son point de départ à
 * -50 %, d'où l'absence de saut visible.
 */
export function Marquee({
  items,
  className,
  itemClassName,
  separatorClassName,
  reverse,
  speed = 28,
}: Props) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          track.current,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 },
        );
      });
      return () => mm.revert();
    },
    { scope: track, dependencies: [reverse, speed] },
  );

  const row = (hidden: boolean) => (
    <div className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item} className={itemClassName ? `marquee__item ${itemClassName}` : "marquee__item"}>
          {item}
          <span className={separatorClassName ? `marquee__sep ${separatorClassName}` : "marquee__sep"} aria-hidden="true">
            ✶
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={className ? `marquee ${className}` : "marquee"}>
      <div ref={track} className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
