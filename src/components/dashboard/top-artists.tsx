import type { TopArtist } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";

/**
 * Compact ranked list of artists. Rank in mono, artist name, a thin
 * horizontal bar proportional to plays relative to rank 1, and a tabular
 * playcount on the right. Rank 1 carries the red accent.
 */
export function TopArtists({ artists }: { artists: TopArtist[] }) {
  if (artists.length === 0) {
    return (
      <section
        aria-labelledby="top-artists-heading"
        className="rounded-lg border border-border bg-card p-5"
      >
        <SectionHeader count={0} />
        <p className="text-xs text-muted-foreground">
          No artists in this period.
        </p>
      </section>
    );
  }

  const max = Math.max(...artists.map((a) => a.playcount), 1);

  return (
    <section
      aria-labelledby="top-artists-heading"
      className="rounded-lg border border-border bg-card p-5"
    >
      <SectionHeader count={artists.length} />
      <ol className="flex flex-col divide-y divide-border">
        {artists.map((artist) => {
          const first = artist.rank === 1;
          const pct = Math.max((artist.playcount / max) * 100, 1.5);
          return (
            <li key={`${artist.rank}-${artist.name}`}>
              <a
                href={artist.url}
                target="_blank"
                rel="noopener"
                className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors duration-150 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span
                  className={`w-6 shrink-0 text-right font-mono text-xs tnum ${
                    first ? "text-primary" : "text-muted-foreground"
                  }`}
                  aria-hidden="true"
                >
                  {artist.rank}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {artist.name}
                  </span>
                  <span
                    className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-white/10"
                    role="presentation"
                  >
                    <span
                      className={`block h-full rounded-full ${
                        first ? "bg-primary" : "bg-chart-2"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                </span>
                <span className="shrink-0 whitespace-nowrap font-mono text-xs tnum text-muted-foreground">
                  {formatNumber(artist.playcount)}
                  <span> plays</span>
                </span>
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
    <header className="mb-3 flex items-baseline justify-between">
      <h2
        id="top-artists-heading"
        className="text-sm font-medium text-foreground"
      >
        Top artists
      </h2>
      {count > 0 && (
        <span className="font-mono text-xs tnum text-muted-foreground">
          {count}
        </span>
      )}
    </header>
  );
}
