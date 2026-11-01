"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Modale accessible : fermeture Échap, focus piégé au premier élément
 * interactif, restauration du focus, `aria-modal`.
 * Style repris de `.modal-overlay` / `.modal` (modern.css).
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 480,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
  labelledBy?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = labelledBy ?? `modal-title-${title.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const node = containerRef.current;
    const focusable = node?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const elements = Array.from(
        node.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay show"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ maxWidth }}
        ref={containerRef}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
        <h2 className="modal-title" id={titleId}>
          {title}
        </h2>
        {description ? <p className="modal-desc">{description}</p> : null}
        {children}
        {footer ? <div style={{ marginTop: 20 }}>{footer}</div> : null}
      </div>
    </div>
  );
}
