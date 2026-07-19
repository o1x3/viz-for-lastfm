"use client";

import { useMemo } from "react";
import type { ListeningStats } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";
import { Sparkline } from "@/components/dither-kit";

const DAY_MS = 86_400_000;
const isoOf = (dayIndex: number) => new Date(dayIndex * DAY_MS).toISOString().slice(0, 10);

function Tile({
  value,
  label,
  detail,
  spark,
}: {
  value: string;
  label: string;
  detail?: string;
  spark?: number[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="tnum mt-1.5 text-2xl font-bold leading-none tracking-tight">{value}</p>
      {detail && <p className="tnum mt-1.5 text-xs text-muted-foreground">{detail}</p>}
      {spark && spark.length > 1 && (
        <Sparkline data={spark} color="red" className="mt-3 h-8" bloom="low" bloomOnHover />
      )}
    </div>
  );
}

/** Stat panel grid — last-90-days numbers; plays tile carries a 14-day sparkline. */
export function StatTiles({ stats }: { stats: ListeningStats }) {
  const avgPerDay = Math.round(stats.total / 90);

  // real 14-day series from byDay — only the plays tile gets a spark, because
  // it's the only stat we have a daily series for
  const spark = useMemo(() => {
    const endDay = Math.floor(stats.to / 86400);
    return Array.from({ length: 14 }, (_, i) => stats.byDay[isoOf(endDay - 13 + i)] ?? 0);
  }, [stats.byDay, stats.to]);

  return (
    <section
      aria-label="Listening statistics, last 90 days"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      <Tile value={formatNumber(stats.total)} label="Plays · 90d" spark={spark} />
      <Tile value={formatNumber(stats.uniqueArtists)} label="Artists" />
      <Tile value={formatNumber(stats.uniqueTracks)} label="Tracks" />
      <Tile
        value={`${stats.currentStreakDays}`}
        label="Day streak"
        detail={`best ${stats.longestStreakDays}`}
      />
      <Tile value={formatNumber(avgPerDay)} label="Avg / day" />
    </section>
  );
}
