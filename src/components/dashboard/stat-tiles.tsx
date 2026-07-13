import type { ListeningStats, UserInfo } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";

function Tile({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail?: string;
}) {
  return (
    <div className="px-5 py-6 first:pl-0 md:py-8">
      <p className="font-display tnum text-4xl leading-none tracking-tight md:text-5xl">{value}</p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      {detail && (
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
          {detail}
        </p>
      )}
    </div>
  );
}

/** Editorial stat band — hairline-ruled columns, not cards. Last-90-days numbers. */
export function StatTiles({ info, stats }: { info: UserInfo; stats: ListeningStats }) {
  const avgPerDay = Math.round(stats.total / 90);

  return (
    <section aria-label="Listening statistics, last 90 days" className="border-y border-border">
      <div className="grid grid-cols-2 md:grid-cols-5 md:divide-x md:divide-border">
        <Tile value={formatNumber(stats.total)} label="plays · 90 days" />
        <Tile value={formatNumber(stats.uniqueArtists)} label="artists" />
        <Tile value={formatNumber(stats.uniqueTracks)} label="tracks" />
        <Tile
          value={`${stats.currentStreakDays}`}
          label="day streak"
          detail={`longest ${stats.longestStreakDays}`}
        />
        <Tile value={formatNumber(avgPerDay)} label="avg / day" />
      </div>
    </section>
  );
}
