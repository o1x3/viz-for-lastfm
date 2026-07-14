import type { ListeningStats } from "@/lib/lastfm/types";
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
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="tnum mt-1.5 text-2xl font-semibold leading-none tracking-tight">
        {value}
      </p>
      {detail && (
        <p className="tnum mt-1.5 text-xs text-muted-foreground">{detail}</p>
      )}
    </div>
  );
}

/** Stat panel grid — last-90-days numbers. */
export function StatTiles({ stats }: { stats: ListeningStats }) {
  const avgPerDay = Math.round(stats.total / 90);

  return (
    <section
      aria-label="Listening statistics, last 90 days"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      <Tile value={formatNumber(stats.total)} label="Plays · 90 days" />
      <Tile value={formatNumber(stats.uniqueArtists)} label="Artists" />
      <Tile value={formatNumber(stats.uniqueTracks)} label="Tracks" />
      <Tile
        value={`${stats.currentStreakDays}`}
        label="Day streak"
        detail={`longest ${stats.longestStreakDays}`}
      />
      <Tile value={formatNumber(avgPerDay)} label="Avg / day" />
    </section>
  );
}
