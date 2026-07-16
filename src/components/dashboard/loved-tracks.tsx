import type { LovedTrack } from "@/lib/lastfm/types";
import { formatDate } from "@/lib/format";

/**
 * Panel listing loved tracks: small red heart, title + artist,
 * loved on date right aligned in mono.
 */
export function LovedTracks({ tracks }: { tracks: LovedTrack[] }) {
  return (
    <section
      aria-labelledby="loved-tracks-heading"
      className="rounded-lg border border-border bg-card p-4 sm:p-5"
    >
      <header className="flex items-baseline justify-between">
        <h2 id="loved-tracks-heading" className="text-sm font-medium text-foreground">
          Loved
        </h2>
        {tracks.length > 0 && (
          <span className="tnum font-mono text-xs text-muted-foreground">
            {tracks.length}
          </span>
        )}
      </header>

      {tracks.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No loved tracks yet.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-border">
          {tracks.map((track) => (
            <li key={`${track.artist}-${track.name}-${track.date}`}>
              <a
                href={track.url}
                target="_blank"
                rel="noopener"
                className="flex items-baseline gap-3 py-2.5 transition-colors duration-150 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span
                  className="shrink-0 text-xs leading-none text-primary"
                  aria-hidden="true"
                >
                  &#9829;
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">
                  <span className="font-medium text-foreground">{track.name}</span>
                  <span className="text-muted-foreground"> by {track.artist}</span>
                </span>
                <span className="tnum shrink-0 font-mono text-xs text-muted-foreground">
                  {formatDate(track.date)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
