import type { TopArtist } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";

/**
 * Festival-poster typographic chart. Artists have no artwork (Last.fm API
 * limitation), so the type IS the visual: Fraunces names sized by rank tier,
 * a proportional hairline bar under each name, tabular playcounts on the
 * right. Rank 1 carries the crimson.
 */

/** Fluid type tiers — clamp() keeps rank-1 names from overflowing at 375px. */
function nameTier(rank: number): string {
  if (rank === 1) return "text-[clamp(2rem,8vw,4.5rem)] font-semibold";
  if (rank <= 3) return "text-[clamp(1.5rem,6vw,3rem)] font-medium";
  if (rank <= 6) return "text-[clamp(1.25rem,4.5vw,1.875rem)] font-medium";
  return "text-[clamp(1.125rem,3.5vw,1.5rem)] font-normal";
}

export function TopArtists({ artists }: { artists: TopArtist[] }) {
  if (artists.length === 0) {
    return (
      <section aria-labelledby="top-artists-heading">
        <SectionHeader count={0} />
        <p className="font-mono text-xs text-muted-foreground">
          No artists in this period.
        </p>
      </section>
    );
  }

  const max = Math.max(...artists.map((a) => a.playcount), 1);

  return (
    <section aria-labelledby="top-artists-heading">
      <SectionHeader count={artists.length} />
      <ol className="flex flex-col">
        {artists.map((artist) => {
          const first = artist.rank === 1;
          const top3 = artist.rank <= 3;
          const pct = Math.max((artist.playcount / max) * 100, 1.5);
          return (
            <li key={`${artist.rank}-${artist.name}`}>
              <a
                href={artist.url}
                target="_blank"
                rel="noopener"
                className="group block py-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <div className="flex items-baseline gap-4 sm:gap-5">
                  <span
                    className={`w-8 shrink-0 text-right font-mono text-xs tnum ${
                      first ? "text-primary" : "text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  >
                    {String(artist.rank).padStart(2, "0")}
                  </span>
                  <span
                    className={`min-w-0 break-words font-display leading-[1.05] tracking-tight transition-colors duration-200 ease-out ${nameTier(
                      artist.rank
                    )} ${
                      first
                        ? "text-primary"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {artist.name}
                  </span>
                  <span className="ml-auto shrink-0 whitespace-nowrap font-mono text-xs tnum text-muted-foreground">
                    {formatNumber(artist.playcount)}
                    <span> plays</span>
                  </span>
                </div>
                <div
                  className="relative mt-2 ml-12 h-px bg-border sm:ml-13"
                  role="presentation"
                >
                  <div
                    className={`absolute inset-y-0 left-0 transition-colors duration-200 ${
                      first
                        ? "bg-primary"
                        : top3
                          ? "bg-foreground/40 group-hover:bg-primary/70"
                          : "bg-foreground/25 group-hover:bg-primary/70"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function SectionHeader({ count }: { count: number }) {
  return (
    <header className="mb-8 flex items-baseline justify-between border-t border-border pt-3">
      <h2
        id="top-artists-heading"
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
      >
        Top Artists
      </h2>
      {count > 0 && (
        <span className="font-mono text-[11px] tnum text-muted-foreground">
          {String(count).padStart(2, "0")}
        </span>
      )}
    </header>
  );
}
