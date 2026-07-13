import type { LovedTrack } from "@/lib/lastfm/types";
import { formatDate } from "@/lib/format";

/**
 * Compact register of loved tracks: crimson heart, title + artist,
 * loved-on date in mono on the right.
 */
export function LovedTracks({ tracks }: { tracks: LovedTrack[] }) {
  return (
    <section aria-labelledby="loved-tracks-heading">
      <header className="mb-4 flex items-baseline justify-between border-t border-border pt-3">
        <h2
          id="loved-tracks-heading"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          Loved
        </h2>
        {tracks.length > 0 && (
          <span className="font-mono text-[11px] tnum text-muted-foreground">
            {String(tracks.length).padStart(2, "0")}
          </span>
        )}
      </header>

      {tracks.length === 0 ? (
        <p className="py-6 text-center font-display text-sm italic text-muted-foreground">
          No loved tracks yet — cold heart or high standards?
        </p>
      ) : (
        <ul className="flex flex-col">
          {tracks.map((track, i) => (
            <li key={`${track.artist}-${track.name}-${track.date}`}>
              <a
                href={track.url}
                target="_blank"
                rel="noopener"
                className={`group flex items-baseline gap-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <span
                  className="shrink-0 text-xs leading-none text-primary"
                  aria-hidden="true"
                >
                  &#9829;
                </span>
                <span className="min-w-0 truncate text-sm">
                  <span className="font-medium transition-colors duration-200 group-hover:text-primary">
                    {track.name}
                  </span>
                  <span className="text-muted-foreground"> — {track.artist}</span>
                </span>
                <span className="ml-auto shrink-0 font-mono text-[11px] tnum text-muted-foreground">
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
