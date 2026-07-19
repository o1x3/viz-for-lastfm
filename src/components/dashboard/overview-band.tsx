"use client";

import { useMemo } from "react";
import type { ListeningStats, TopArtist } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";
import type { DitherColor } from "@/components/dither-kit";
import { Pie, PieChart, Sparkline } from "@/components/dither-kit";
import { PALETTE, rgb } from "@/components/dither-kit/palette";

/**
 * Overview band — one hairline-divided panel with three zones: the hero
 * number (90-day plays + 14-day trend), a 2×2 quad of secondary stats, and
 * the period's play share (donut + vertical legend).
 */

const SLICE_COLORS: DitherColor[] = ["red", "orange", "pink", "purple", "blue"];

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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </p>
  );
}

function ZoneError() {
  return <p className="text-xs text-muted-foreground/70">Could not load this section.</p>;
}

function QuadCell({ label, value, detail }: { label: string; value: string; detail?: string }) {
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

export function OverviewBand({
  stats,
  artists,
}: {
  stats: ListeningStats | null;
  artists: TopArtist[] | null;
}) {
  const share = useMemo(() => {
    if (!artists || artists.length === 0) return null;
    const top = artists.slice(0, 5);
    const rest = artists.slice(5).reduce((sum, a) => sum + a.playcount, 0);
    const rows = top.map((a) => ({ name: a.name, plays: a.playcount }));
    if (rest > 0) rows.push({ name: "Other", plays: rest });
    const config = Object.fromEntries(
      rows.map((r, i) => [
        r.name,
        { label: r.name, color: i < top.length ? SLICE_COLORS[i] : ("grey" as const) },
      ]),
    );
    return { rows, config };
  }, [artists]);

  const avgPerDay = stats ? Math.round(stats.total / 90) : 0;

  return (
    <section
      aria-label="Overview: listening statistics and play share"
      className="grid divide-y divide-border overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-[1.1fr_1.6fr] lg:divide-x lg:divide-y-0"
    >
      {/* quad — secondary stats */}
      {stats ? (
        <div className="grid grid-cols-2 gap-px bg-border">
          <QuadCell label="Artists" value={formatNumber(stats.uniqueArtists)} />
          <QuadCell label="Tracks" value={formatNumber(stats.uniqueTracks)} />
          <QuadCell
            label="Day streak"
            value={`${stats.currentStreakDays}`}
            detail={`best ${stats.longestStreakDays}`}
          />
          <QuadCell label="Avg / day" value={formatNumber(avgPerDay)} />
        </div>
      ) : (
        <div className="flex items-center p-5">
          <ZoneError />
        </div>
      )}

      {/* share — donut + vertical legend */}
      <div className="flex flex-col p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-foreground">Play share</h2>
          <span className="font-mono text-xs tnum text-muted-foreground">top 5</span>
        </div>
        {share ? (
          <div className="flex flex-1 items-center gap-5">
            <PieChart
              data={share.rows}
              config={share.config}
              dataKey="plays"
              nameKey="name"
              innerRadius={0.62}
              className="size-36 flex-none"
              bloom="low"
            >
              <Pie variant="gradient" />
            </PieChart>
            <ul className="min-w-0 flex-1 space-y-1.5 text-xs">
              {share.rows.map((r) => (
                <li key={r.name} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2 flex-none rounded-[2px]"
                    style={{ background: rgb(PALETTE[share.config[r.name].color].fill) }}
                  />
                  <span className="min-w-0 flex-1 truncate">{r.name}</span>
                  <span className="tnum font-mono text-muted-foreground">
                    {formatNumber(r.plays)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ZoneError />
        )}
      </div>
    </section>
  );
}
