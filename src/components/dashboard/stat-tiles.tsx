import type { ListeningStats } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";

function Tile({
  value,
  label,
  detail,
  className = "",
}: {
  value: string;
  label: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={`py-6 md:px-5 md:py-8 md:first:pl-0 ${className}`}>
      <p className="font-display tnum text-4xl leading-none tracking-tight md:text-5xl">{value}</p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      {detail && (
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {detail}
        </p>
      )}
    </div>
  );
}

/** Editorial stat band — hairline-ruled columns, not cards. Last-90-days numbers. */
export function StatTiles({ stats }: { stats: ListeningStats }) {
  const avgPerDay = Math.round(stats.total / 90);

  return (
    <section aria-label="Listening statistics, last 90 days" className="border-y border-border">
      {/*
        Mobile: 2-col grid — left column flush-left, even cells get a hairline
        left rule + matching padding, rows 2+ get a hairline top rule.
        md+: single 5-col row with vertical hairline dividers.
      */}
      <div
        className={[
          "grid grid-cols-2 md:grid-cols-5 md:divide-x md:divide-border",
          "max-md:[&>*:nth-child(even)]:border-l max-md:[&>*:nth-child(even)]:border-border max-md:[&>*:nth-child(even)]:pl-5",
          "max-md:[&>*:nth-child(odd)]:pr-5",
          "max-md:[&>*:nth-child(n+3)]:border-t max-md:[&>*:nth-child(n+3)]:border-border",
        ].join(" ")}
      >
        <Tile value={formatNumber(stats.total)} label="plays · 90 days" />
        <Tile value={formatNumber(stats.uniqueArtists)} label="artists" />
        <Tile value={formatNumber(stats.uniqueTracks)} label="tracks" />
        <Tile
          value={`${stats.currentStreakDays}`}
          label="day streak"
          detail={`longest ${stats.longestStreakDays}`}
        />
        <Tile
          value={formatNumber(avgPerDay)}
          label="avg / day"
          className="max-md:col-span-2"
        />
      </div>
    </section>
  );
}
