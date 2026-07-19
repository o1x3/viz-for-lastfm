"use client";

import { useMemo } from "react";
import type { ListeningStats } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";
import { Sparkline } from "@/components/dither-kit";

const DAY_MS = 86_400_000;
const isoOf = (dayIndex: number) => new Date(dayIndex * DAY_MS).toISOString().slice(0, 10);

function Row({
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
    <div className="flex flex-1 items-center justify-between gap-4 px-4 py-2.5">
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      {value && (
        <p className="tnum text-lg font-bold leading-none tracking-tight">
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
 * Stat ledger — six slim label/value rows dividing the panel's full height,
 * so it lines up with the play-share donut without dead space.
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
      className="flex h-full flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-card"
    >
      <Row label="Plays · 90d" value={formatNumber(stats.total)} />
      <Row label="Artists" value={formatNumber(stats.uniqueArtists)} />
      <Row label="Tracks" value={formatNumber(stats.uniqueTracks)} />
      <Row
        label="Day streak"
        value={`${stats.currentStreakDays}`}
        detail={`best ${stats.longestStreakDays}`}
      />
      <Row label="Avg / day" value={formatNumber(avgPerDay)} />
      <Row label="Trend · 14d">
        <Sparkline data={spark} color="red" className="h-6 w-40" bloom="low" bloomOnHover />
      </Row>
    </section>
  );
}
