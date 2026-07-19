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
 * Plays by weekday, Monday first — dithered bars (dither-kit), dotted
 * variant to read differently from the hourly chart. Peak readout below.
 */

const DAY_ABBR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NAME = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CONFIG = { plays: { label: "plays", color: "red" as const } };

export function WeekdayBars({ byWeekday }: { byWeekday: number[] }) {
  const { rows, total, max, peak } = useMemo(() => {
    // incoming index 0 = Sunday; display Monday-first
    const values = [1, 2, 3, 4, 5, 6, 0].map((i) => byWeekday[i] ?? 0);
    const total = values.reduce((a, b) => a + b, 0);
    const max = Math.max(...values);
    return {
      rows: values.map((plays, i) => ({ day: DAY_ABBR[i], plays })),
      total,
      max,
      peak: values.indexOf(max),
    };
  }, [byWeekday]);

  return (
    <figure className="w-full">
      <div
        role="img"
        aria-label={
          total > 0
            ? `Plays by weekday, Monday first. Peak day ${DAY_NAME[peak]} with ${formatNumber(max)} plays out of ${formatNumber(total)} total.`
            : "Plays by weekday. No plays recorded in this period."
        }
      >
        <BarChart data={rows} config={CONFIG} className="h-48" bloom="low">
          <Grid />
          <XAxis dataKey="day" maxTicks={7} />
          <YAxis />
          <Bar dataKey="plays" variant="dotted" />
          <Tooltip />
        </BarChart>
      </div>

      <figcaption className="mt-3 text-xs text-muted-foreground">
        {total > 0 ? (
          <>
            Peak day <span className="font-semibold text-foreground">{DAY_NAME[peak]}</span> ·{" "}
            <span className="tnum font-semibold">{formatNumber(max)}</span> plays
          </>
        ) : (
          <>No plays this period</>
        )}
      </figcaption>
    </figure>
  );
}
