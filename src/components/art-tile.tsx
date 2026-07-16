import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Square album art tile. When no artwork exists, renders a neutral
 * fallback: the first letter of the label in the muted foreground tone
 * on a secondary gray tile.
 *
 * Server safe: no hooks, no client APIs.
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

  const initial = (label.trim().charAt(0) || "?").toUpperCase();

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-sm bg-secondary [container-type:inline-size]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="select-none font-medium leading-none text-muted-foreground text-[42cqw]"
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
