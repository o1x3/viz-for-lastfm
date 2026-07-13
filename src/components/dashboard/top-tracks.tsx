import type { TopTrack } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";

/**
 * Vinyl liner tracklist: rank, title, a dotted leader line (like a
 * table-of-contents), artist, playcount. Dense and elegant; top 3
 * ranks carry the crimson.
 */
export function TopTracks({ tracks }: { tracks: TopTrack[] }) {
  return (
    <section aria-labelledby="top-tracks-heading">
      <header className="mb-4 flex items-baseline justify-between border-t border-border pt-3">
        <h2
          id="top-tracks-heading"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          Top Tracks
        </h2>
        {tracks.length > 0 && (
          <span className="font-mono text-[11px] tnum text-muted-foreground">
            {String(tracks.length).padStart(2, "0")}
          </span>
        )}
      </header>

      {tracks.length === 0 ? (
        <p className="font-mono text-xs text-muted-foreground">
          No tracks in this period.
        </p>
      ) : (
        <ol className="flex flex-col">
          {tracks.map((track) => {
            const top3 = track.rank <= 3;
            return (
              <li key={`${track.rank}-${track.artist}-${track.name}`}>
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener"
                  className="group flex items-baseline gap-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span
                    className={`w-6 shrink-0 text-right font-mono text-xs tnum ${
                      top3 ? "text-primary" : "text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  >
                    {track.rank}
                  </span>
                  <span className="max-w-[50%] truncate text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                    {track.name}
                  </span>
                  <span
                    className="min-w-4 flex-1 -translate-y-[0.2em] border-b border-dotted border-foreground/20"
                    aria-hidden="true"
                  />
                  <span className="max-w-[28%] truncate text-xs text-muted-foreground">
                    {track.artist}
                  </span>
                  <span className="shrink-0 font-mono text-xs tnum text-muted-foreground transition-colors duration-200 ease-out group-hover:text-primary">
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
