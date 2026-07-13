import { formatNumber } from "@/lib/format";

/**
 * Editorial horizontal weekday bars, Monday first. Day letters in mono on the
 * left, a cream hairline track, a thin cream bar (peak day in crimson), and a
 * right-aligned tabular count. No gridlines, no axes. Server-safe SVG.
 */

const DAY_ABBR = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const DAY_NAME = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// geometry
const W = 480;
const ROW_H = 27;
const H = ROW_H * 7;
const TRACK_X0 = 36;
const TRACK_X1 = 396;
const COUNT_X = W;
const BAR_H = 7;

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
                fontFamily="var(--font-spline-mono), monospace"
                fontSize={10}
                letterSpacing="0.15em"
              >
                {DAY_ABBR[i]}
              </text>
              {/* hairline track */}
              <line
                x1={TRACK_X0}
                y1={cy}
                x2={TRACK_X1}
                y2={cy}
                stroke="var(--border)"
                strokeWidth={1}
              />
              {/* bar */}
              {barW > 0 && (
                <rect
                  x={TRACK_X0}
                  y={cy - BAR_H / 2}
                  width={Number(barW.toFixed(2))}
                  height={BAR_H}
                  rx={1}
                  fill={isPeak ? "var(--crimson)" : "var(--cream)"}
                  fillOpacity={isPeak ? 0.95 : 0.8}
                />
              )}
              <text
                x={COUNT_X}
                y={cy}
                textAnchor="end"
                dominantBaseline="central"
                fill={isPeak ? "var(--cream)" : "var(--muted-foreground)"}
                fontFamily="var(--font-spline-mono), monospace"
                fontSize={11}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatNumber(v)}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground tnum">
        {total > 0 ? (
          <>
            Peak day <span className="text-foreground">{DAY_NAME[peak]}</span> ·{" "}
            {formatNumber(max)} plays
          </>
        ) : (
          <>No plays this period</>
        )}
      </figcaption>
    </figure>
  );
}
