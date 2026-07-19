"use client";

import { useMemo } from "react";
import { formatNumber } from "@/lib/format";
import {
  ActiveDot,
  Area,
  AreaChart,
  Grid,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/dither-kit";

/**
 * 90-day daily-plays area — dithered fill (dither-kit), month ticks on the
 * x-axis, peak/total readout below. Replaces the GitHub-style heat strip.
 */

const DAY_MS = 86_400_000;
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const isoOf = (dayIndex: number) => new Date(dayIndex * DAY_MS).toISOString().slice(0, 10);

function prettyDate(dayIndex: number): string {
  const d = new Date(dayIndex * DAY_MS);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

const CONFIG = { plays: { label: "plays", color: "red" as const } };

export function DayStrip({
  byDay,
  from,
  to,
}: {
  byDay: Record<string, number>;
  from: number;
  to: number;
}) {
  const { rows, total, max, maxDay, days } = useMemo(() => {
    const startDay = Math.floor(from / 86400);
    const endDay = Math.floor(to / 86400);
    const rows: { label: string; plays: number }[] = [];
    let total = 0;
    let max = 0;
    let maxDay = -1;
    let prevMonth = -1;
    let lastLabelAt = -10;
    for (let d = startDay; d <= endDay; d++) {
      const v = byDay[isoOf(d)] ?? 0;
      total += v;
      if (v > max) {
        max = v;
        maxDay = d;
      }
      const m = new Date(d * DAY_MS).getUTCMonth();
      let label = "";
      const i = d - startDay;
      if (m !== prevMonth && i - lastLabelAt >= 10) {
        label = MONTHS[m];
        lastLabelAt = i;
      }
      prevMonth = m;
      rows.push({ label, plays: v });
    }
    return { rows, total, max, maxDay, days: endDay - startDay + 1 };
  }, [byDay, from, to]);

  return (
    <figure className="w-full">
      <div
        role="img"
        aria-label={
          total > 0
            ? `Daily plays over the last ${days} days. ${formatNumber(total)} plays total. Peak on ${prettyDate(maxDay)} with ${formatNumber(max)} plays.`
            : `Daily plays over the last ${days} days. No plays recorded.`
        }
      >
        <AreaChart data={rows} config={CONFIG} className="h-48" bloom="low">
          <Grid />
          <XAxis dataKey="label" maxTicks={rows.length} tickFormatter={(v) => String(v ?? "")} />
          <YAxis />
          <Area dataKey="plays" variant="gradient">
            <ActiveDot />
          </Area>
          {total > 0 && (
            <ReferenceLine y={Math.round(total / days)} label={`avg ${Math.round(total / days)}`} />
          )}
          <Tooltip />
        </AreaChart>
      </div>

      <figcaption className="mt-3 text-xs text-muted-foreground">
        {total > 0 ? (
          <>
            Peak <span className="font-semibold text-foreground">{prettyDate(maxDay)}</span> ·{" "}
            <span className="tnum font-semibold">{formatNumber(max)}</span> plays ·{" "}
            <span className="tnum font-semibold">{formatNumber(total)}</span> total
          </>
        ) : (
          <>No plays in the last {days} days</>
        )}
      </figcaption>
    </figure>
  );
}
