"use client";

import { useMemo } from "react";
import type { ListeningStats } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";
import { Sparkline } from "@/components/dither-kit";

const DAY_MS = 86_400_000;
const isoOf = (dayIndex: number) => new Date(dayIndex * DAY_MS).toISOString().slice(0, 10);

function Cell({
  label,
  value,
  detail,
  children,
}: {
  label: string;
  value?: string;
  detail?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center bg-card p-4">
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      {value && (
        <p className="tnum mt-1 text-xl font-bold leading-none tracking-tight">
          {value}
          {detail && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">{detail}</span>
          )}
        </p>
      )}
      {children}
    </div>
  );
}

/**
 * Compact stat panel — one bordered card, hairline-divided 3×2 grid.
 * The sixth cell is a real 14-day sparkline from byDay.
 */
export function StatTiles({ stats }: { stats: ListeningStats }) {
  const avgPerDay = Math.round(stats.total / 90);

  const spark = useMemo(() => {
    const endDay = Math.floor(stats.to / 86400);
    return Array.from({ length: 14 }, (_, i) => stats.byDay[isoOf(endDay - 13 + i)] ?? 0);
  }, [stats.byDay, stats.to]);

  return (
    <section
      aria-label="Listening statistics, last 90 days"
      className="grid h-full grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3"
    >
      <Cell label="Plays · 90d" value={formatNumber(stats.total)} />
      <Cell label="Artists" value={formatNumber(stats.uniqueArtists)} />
      <Cell label="Tracks" value={formatNumber(stats.uniqueTracks)} />
      <Cell
        label="Day streak"
        value={`${stats.currentStreakDays}`}
        detail={`best ${stats.longestStreakDays}`}
      />
      <Cell label="Avg / day" value={formatNumber(avgPerDay)} />
      <Cell label="Trend · 14d">
        <Sparkline data={spark} color="red" className="mt-2 h-7" bloom="low" bloomOnHover />
      </Cell>
    </section>
  );
}
