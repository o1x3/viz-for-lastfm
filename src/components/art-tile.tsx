import Image from "next/image";
import { cn } from "@/lib/utils";

/** Small deterministic string hash for stable fallback tones. */
function hashLabel(label: string): number {
  let h = 5381;
  for (let i = 0; i < label.length; i++) {
    h = (h * 33) ^ label.charCodeAt(i);
  }
  return Math.abs(h);
}

/**
 * Square album-art tile. When no artwork exists, renders a typographic
 * fallback: the first letter of the label set huge in Fraunces italic on a
 * warm tone derived deterministically from the label — subtle variations of
 * the sleeve's near-black, never rainbow.
 *
 * Server-safe: no hooks, no client APIs.
 */
export function ArtTile({
  src,
  alt,
  label,
  className,
}: {
  src: string | null;
  alt: string;
  label: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative aspect-square overflow-hidden rounded-sm bg-muted", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 40vw, 240px"
          className="object-cover"
        />
      </div>
    );
  }

  const h = hashLabel(label);
  const lightness = 0.21 + (h % 6) * 0.01; // 0.21 – 0.26
  const chroma = 0.012 + ((h >> 3) % 5) * 0.002; // 0.012 – 0.020
  const hue = 45 + ((h >> 6) % 50); // 45 – 94 (warm band)
  const initial = (label.trim().charAt(0) || "?").toUpperCase();

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-sm [container-type:inline-size]",
        className,
      )}
      style={{ backgroundColor: `oklch(${lightness} ${chroma} ${hue})` }}
    >
      <span
        aria-hidden="true"
        className="font-display select-none italic leading-none text-[46cqw]"
        style={{ color: "oklch(0.93 0.018 85 / 0.38)" }}
      >
        {initial}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-foreground/5"
      />
    </div>
  );
}
