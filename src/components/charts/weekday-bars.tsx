import { formatNumber } from "@/lib/format";

/**
 * Horizontal weekday bars, Monday first. Day labels in mono on the left,
 * a faint rounded track, a light-gray fill (peak day in red), and a
 * right-aligned tabular count. No gridlines, no axes. Server-safe SVG.
 */

const DAY_ABBR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NAME = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// geometry
const W = 480;
const ROW_H = 27;
const H = ROW_H * 7;
const TRACK_X0 = 36;
const TRACK_X1 = 396;
const COUNT_X = W;
const BAR_H = 6;

export function WeekdayBars({ byWeekday }: { byWeekday: number[] }) {
  // incoming index 0 = Sunday; display Monday-first
  const values = [1, 2, 3, 4, 5, 6, 0].map((i) => byWeekday[i] ?? 0);
  const total = values.reduce((a, b) => a + b, 0);
  const max = Math.max(...values);
  const peak = values.indexOf(max);

  const label =
    total > 0
      ? `Plays by weekday, Monday first. Peak day ${DAY_NAME[peak]} with ${formatNumber(max)} plays out of ${formatNumber(total)} total.`
      : "Plays by weekday. No plays recorded in this period.";

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label}
        className="block w-full h-auto"
      >
        {values.map((v, i) => {
          const cy = i * ROW_H + ROW_H / 2;
          const isPeak = total > 0 && i === peak;
          const barW = max > 0 ? ((TRACK_X1 - TRACK_X0) * v) / max : 0;
          return (
            <g key={DAY_ABBR[i]}>
              <title>{`${DAY_NAME[i]} · ${formatNumber(v)} plays`}</title>
              <text
                x={0}
                y={cy}
                dominantBaseline="central"
                fill="var(--muted-foreground)"
                fontFamily="var(--font-geist-mono), monospace"
                fontSize={10}
              >
                {DAY_ABBR[i]}
              </text>
              {/* track */}
              <rect
                x={TRACK_X0}
                y={cy - BAR_H / 2}
                width={TRACK_X1 - TRACK_X0}
                height={BAR_H}
                rx={BAR_H / 2}
                fill="var(--foreground)"
                fillOpacity={0.05}
              />
              {/* bar */}
              {barW > 0 && (
                <rect
                  x={TRACK_X0}
                  y={cy - BAR_H / 2}
                  width={Number(barW.toFixed(2))}
                  height={BAR_H}
                  rx={BAR_H / 2}
                  fill={isPeak ? "var(--chart-1)" : "var(--chart-2)"}
                />
              )}
              <text
                x={COUNT_X}
                y={cy}
                textAnchor="end"
                dominantBaseline="central"
                fill={isPeak ? "var(--foreground)" : "var(--muted-foreground)"}
                fontFamily="var(--font-geist-mono), monospace"
                fontSize={11}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatNumber(v)}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 text-xs text-muted-foreground">
        {total > 0 ? (
          <>
            Peak day <span className="text-foreground">{DAY_NAME[peak]}</span>{" "}
            · <span className="font-mono tnum">{formatNumber(max)}</span> plays
          </>
        ) : (
          <>No plays this period</>
        )}
      </figcaption>
    </figure>
  );
}
