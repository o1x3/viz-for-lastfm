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

/** Editorial timeline of the latest scrobbles. */
export function RecentTracks({ page }: { page: RecentTracksPage }) {
  const tracks = (page.tracks[0]?.nowPlaying ? page.tracks.slice(1) : page.tracks).slice(0, 15);

  return (
    <section aria-labelledby="recent-heading">
      <div className="border-t border-border pt-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          the log
        </p>
        <h2 id="recent-heading" className="mt-1 font-display text-3xl tracking-tight">
          Recently played
        </h2>
      </div>

      <ol className="mt-6">
        {tracks.map((t, i) => (
          <li
            key={`${t.url}-${t.date}-${i}`}
            className="flex items-baseline gap-4 border-b border-border/60 py-2.5"
          >
            <span className="tnum w-16 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {t.date ? timeAgo(t.date) : "—"}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">
              <span className="text-foreground">{t.name}</span>
              <span className="text-muted-foreground"> — {t.artist}</span>
            </span>
            {t.loved && <Heart />}
          </li>
        ))}
      </ol>

      <p className="tnum mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {formatNumber(page.total)} scrobbles on record
      </p>
    </section>
  );
}
