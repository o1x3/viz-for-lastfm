"use client";

import { useMemo } from "react";
import { formatNumber } from "@/lib/format";
import {
  Bar,
  BarChart,
  Grid,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/dither-kit";

/**
 * Plays by hour of day — 24 dithered bars (dither-kit). Replaces the radial
 * clock; keeps the peak-hour readout below.
 */

const pad2 = (h: number) => String(h).padStart(2, "0");

const CONFIG = { plays: { label: "plays", color: "orange" as const } };

export function ListeningClock({ byHour }: { byHour: number[] }) {
  const { rows, total, max, peakHour } = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => byHour[h] ?? 0);
    const total = hours.reduce((a, b) => a + b, 0);
    const max = Math.max(...hours);
    return {
      rows: hours.map((plays, h) => ({ hour: pad2(h), plays })),
      total,
      max,
      peakHour: hours.indexOf(max),
    };
  }, [byHour]);

  return (
    <figure className="w-full">
      <div
        role="img"
        aria-label={
          total > 0
            ? `Plays by hour of day. Peak hour ${pad2(peakHour)}:00 with ${formatNumber(max)} plays out of ${formatNumber(total)} total.`
            : "Plays by hour of day. No plays recorded in this period."
        }
      >
        <BarChart data={rows} config={CONFIG} className="h-48" bloom="low">
          <Grid />
          <XAxis dataKey="hour" maxTicks={6} />
          <YAxis />
          <Bar dataKey="plays" variant="gradient" />
          <Tooltip />
        </BarChart>
      </div>

      <figcaption className="mt-3 text-xs text-muted-foreground">
        {total > 0 ? (
          <>
            Peak hour{" "}
            <span className="tnum font-semibold text-foreground">{pad2(peakHour)}:00</span> ·{" "}
            <span className="tnum font-semibold">{formatNumber(total)}</span> plays
          </>
        ) : (
          <>No plays this period</>
        )}
      </figcaption>
    </figure>
  );
}
