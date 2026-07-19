"use client";

import type { ListeningStats } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";
import { Sparkline } from "@/components/dither-kit";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </p>
  );
}

/**
 * Right cluster of the now-playing strip: the 90-day plays number plus the
 * 14-day sparkline, baseline flush with the strip's bottom edge (the strip
 * container drops its vertical padding so the chart can sit on the border).
 */
export function TrendSpark({ data, total }: { data: number[]; total: number }) {
  return (
    <div className="flex shrink-0 items-end gap-4 self-stretch">
      <div className="py-2.5 text-right">
        <Label>Plays · 90d</Label>
        <p className="tnum mt-1 text-2xl font-bold leading-none tracking-tight">
          {formatNumber(total)}
        </p>
      </div>
      <Sparkline
        data={data}
        color="red"
        className="hidden h-16 w-80 self-end sm:block"
        bloom="low"
        bloomOnHover
      />
    </div>
  );
}

function Cell({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="flex flex-col justify-center bg-card p-4">
      <Label>{label}</Label>
      <p className="tnum mt-1.5 text-xl font-bold leading-none tracking-tight">
        {value}
        {detail && (
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">{detail}</span>
        )}
      </p>
    </div>
  );
}

/** Slim stat strip — four hairline-divided cells, 90-day numbers. */
export function OverviewBand({ stats }: { stats: ListeningStats }) {
  const avgPerDay = Math.round(stats.total / 90);

  return (
    <section
      aria-label="Listening statistics, last 90 days"
      className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
    >
      <Cell label="Artists" value={formatNumber(stats.uniqueArtists)} />
      <Cell label="Tracks" value={formatNumber(stats.uniqueTracks)} />
      <Cell
        label="Day streak"
        value={`${stats.currentStreakDays}`}
        detail={`best ${stats.longestStreakDays}`}
      />
      <Cell label="Avg / day" value={formatNumber(avgPerDay)} />
    </section>
  );
}
