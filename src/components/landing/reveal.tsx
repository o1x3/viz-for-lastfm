import type { CSSProperties, ReactNode } from "react";

/**
 * Staggered load reveal for the landing page. Pure CSS (see .reveal in
 * globals.css) so content never depends on JS/hydration to become visible —
 * the fade runs immediately on paint, and prefers-reduced-motion collapses it.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={className ? `reveal ${className}` : "reveal"}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
