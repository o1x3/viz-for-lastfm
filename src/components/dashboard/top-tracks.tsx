import type { TopTrack } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";

/**
 * Clean ranked tracklist: rank, title, artist, tabular playcount.
 * Rank 1 carries the red accent.
 */
export function TopTracks({ tracks }: { tracks: TopTrack[] }) {
  return (
    <section
      aria-labelledby="top-tracks-heading"
      className="rounded-lg border border-border bg-card p-5"
    >
      <header className="mb-3 flex items-baseline justify-between">
        <h2
          id="top-tracks-heading"
          className="text-sm font-medium text-foreground"
        >
          Top tracks
        </h2>
        {tracks.length > 0 && (
          <span className="font-mono text-xs tnum text-muted-foreground">
            {tracks.length}
          </span>
        )}
      </header>

      {tracks.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No tracks in this period.
        </p>
      ) : (
        <ol className="flex flex-col divide-y divide-border">
          {tracks.map((track) => {
            const first = track.rank === 1;
            return (
              <li key={`${track.rank}-${track.artist}-${track.name}`}>
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener"
                  className="group -mx-2 flex items-baseline gap-3 rounded-md px-2 py-2.5 transition-colors duration-150 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span
                    className={`w-6 shrink-0 text-right font-mono text-xs tnum ${
                      first ? "text-primary" : "text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  >
                    {track.rank}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {track.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {track.artist}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs tnum text-muted-foreground">
                    {formatNumber(track.playcount)}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
