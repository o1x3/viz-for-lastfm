"use client";

import { useMemo } from "react";
import { formatNumber } from "@/lib/format";
import { Radar, RadarChart } from "@/components/dither-kit";

/**
 * Radial listening clock: a 24-axis dithered radar (dither-kit), midnight at
 * the top. The polygon's shape is the day's listening silhouette; cardinal
 * hours are labeled, the rest of the axes stay bare.
 */

const pad2 = (h: number) => String(h).padStart(2, "0");

const CONFIG = { plays: { label: "plays", color: "orange" as const } };

export function ListeningClock({ byHour }: { byHour: number[] }) {
  const { rows, total, max, peakHour } = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => byHour[h] ?? 0);
    const total = hours.reduce((a, b) => a + b, 0);
    const max = Math.max(...hours);
    return {
      rows: hours.map((plays, h) => ({
        // cardinal hours get labels; the rest use unique invisible strings so
        // the frame renders a bare spoke (labels double as React keys)
        hour: h % 6 === 0 ? pad2(h) : "​".repeat(h),
        plays,
      })),
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
            ? `Listening clock. Peak hour ${pad2(peakHour)}:00 with ${formatNumber(max)} plays out of ${formatNumber(total)} total.`
            : "Listening clock. No plays recorded in this period."
        }
      >
        <RadarChart data={rows} config={CONFIG} nameKey="hour" className="h-56" bloom="low">
          <Radar dataKey="plays" variant="gradient" />
        </RadarChart>
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
