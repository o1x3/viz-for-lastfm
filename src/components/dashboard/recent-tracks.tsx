import type { RecentTracksPage } from "@/lib/lastfm/types";
import { formatNumber, timeAgo } from "@/lib/format";

function Heart() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3 shrink-0 fill-primary"
      role="img"
      aria-label="Loved track"
    >
      <path d="M8 14.2 2.9 9.1a3.6 3.6 0 0 1 0-5.1 3.6 3.6 0 0 1 5.1 0 3.6 3.6 0 0 1 5.1 0 3.6 3.6 0 0 1 0 5.1L8 14.2Z" />
    </svg>
  );
}

/** Panel listing the latest scrobbles. */
export function RecentTracks({ page }: { page: RecentTracksPage }) {
  const tracks = (page.tracks[0]?.nowPlaying ? page.tracks.slice(1) : page.tracks).slice(0, 15);

  return (
    <section
      aria-labelledby="recent-heading"
      className="rounded-lg border border-border bg-card p-4 sm:p-5"
    >
      <h2 id="recent-heading" className="text-sm font-medium text-foreground">
        Recently played
      </h2>

      <ol className="mt-2 divide-y divide-border">
        {tracks.map((t, i) => (
          <li
            key={`${t.url}-${t.date}-${i}`}
            className="flex items-baseline gap-3 py-2.5"
          >
            <span className="min-w-0 flex-1 truncate text-sm">
              <span className="text-foreground">{t.name}</span>
              <span className="text-muted-foreground"> — {t.artist}</span>
            </span>
            {t.loved && <Heart />}
            <span className="tnum shrink-0 font-mono text-xs text-muted-foreground">
              {t.date ? timeAgo(t.date) : "—"}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-xs text-muted-foreground">
        <span className="tnum font-mono">{formatNumber(page.total)}</span> scrobbles on record
      </p>
    </section>
  );
}
