import { formatNumber } from "@/lib/format";

/**
 * 90-day heat strip — GitHub-style weeks. Columns are weeks, rows Mon..Sun.
 * Intensity ramps through low cream opacities; only the single max day is
 * crimson. Empty days are barely-visible hairline squares. Server-safe SVG.
 */

const DAY_MS = 86_400_000;
const CELL = 10;
const PITCH = 13; // cell + gap
const TOP = 18; // month label band
const LEFT = 1;

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTHS_TITLE = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** UTC day index (days since epoch) → Monday-based row 0..6 */
const rowOf = (dayIndex: number) => (dayIndex + 3) % 7;

const isoOf = (dayIndex: number) => new Date(dayIndex * DAY_MS).toISOString().slice(0, 10);

function prettyDate(dayIndex: number): string {
  const d = new Date(dayIndex * DAY_MS);
  return `${MONTHS_TITLE[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

const LEGEND_STEPS = [0.14, 0.34, 0.56, 0.84];

export function DayStrip({
  byDay,
  from,
  to,
}: {
  byDay: Record<string, number>;
  from: number;
  to: number;
}) {
  const startDay = Math.floor(from / 86400);
  const endDay = Math.floor(to / 86400);
  const gridStart = startDay - rowOf(startDay); // Monday on/before the range start
  const weeks = Math.max(1, Math.ceil((endDay - gridStart + 1) / 7));

  // scan for total / max
  let total = 0;
  let max = 0;
  let maxDay = -1;
  for (let d = startDay; d <= endDay; d++) {
    const v = byDay[isoOf(d)] ?? 0;
    total += v;
    if (v > max) {
      max = v;
      maxDay = d;
    }
  }

  // month labels: label a column when its first in-range day starts a new month,
  // keeping at least 3 columns between labels so they never collide
  const monthLabels: { w: number; text: string }[] = [];
  let prevMonth = -1;
  let lastLabelW = -3;
  for (let w = 0; w < weeks; w++) {
    let first = -1;
    for (let r = 0; r < 7; r++) {
      const d = gridStart + w * 7 + r;
      if (d >= startDay && d <= endDay) {
        first = d;
        break;
      }
    }
    if (first < 0) continue;
    const m = new Date(first * DAY_MS).getUTCMonth();
    if (m !== prevMonth) {
      if (w - lastLabelW >= 3) {
        monthLabels.push({ w, text: MONTHS[m] });
        lastLabelW = w;
      }
      prevMonth = m;
    }
  }

  const width = LEFT + weeks * PITCH - (PITCH - CELL) + 1;
  const height = TOP + 7 * PITCH - (PITCH - CELL) + 1;
  const days = endDay - startDay + 1;

  const label =
    total > 0
      ? `Daily plays over the last ${days} days. ${formatNumber(total)} plays total. Peak on ${prettyDate(maxDay)} with ${formatNumber(max)} plays.`
      : `Daily plays over the last ${days} days. No plays recorded.`;

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="block w-full h-auto max-w-[560px]"
      >
        {monthLabels.map(({ w, text }) => (
          <text
            key={`m-${w}`}
            x={LEFT + w * PITCH}
            y={10}
            fill="var(--muted-foreground)"
            fontFamily="var(--font-spline-mono), monospace"
            fontSize={9}
            letterSpacing="0.15em"
          >
            {text}
          </text>
        ))}

        {Array.from({ length: weeks }, (_, w) =>
          Array.from({ length: 7 }, (_, r) => {
            const d = gridStart + w * 7 + r;
            if (d < startDay || d > endDay) return null;
            const v = byDay[isoOf(d)] ?? 0;
            const x = LEFT + w * PITCH;
            const y = TOP + r * PITCH;
            const isMax = max > 0 && d === maxDay;
            const t = max > 0 ? v / max : 0;
            return (
              <rect
                key={d}
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={2}
                fill={isMax ? "var(--crimson)" : v > 0 ? "var(--cream)" : "none"}
                fillOpacity={
                  isMax ? 0.95 : v > 0 ? Number((0.14 + 0.7 * Math.sqrt(t)).toFixed(2)) : undefined
                }
                stroke={v > 0 ? "none" : "var(--border)"}
                strokeWidth={v > 0 ? 0 : 1}
              >
                <title>{`${prettyDate(d)} · ${formatNumber(v)} ${v === 1 ? "play" : "plays"}`}</title>
              </rect>
            );
          })
        )}
      </svg>

      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground tnum">
        <span>
          {total > 0 ? (
            <>
              Peak <span className="text-foreground">{prettyDate(maxDay)}</span> ·{" "}
              {formatNumber(max)} plays · {formatNumber(total)} total
            </>
          ) : (
            <>No plays in the last {days} days</>
          )}
        </span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="mr-1">Less</span>
          {LEGEND_STEPS.map((o) => (
            <span
              key={o}
              className="inline-block size-2.5 rounded-[2px]"
              style={{ background: "var(--cream)", opacity: o }}
            />
          ))}
          <span
            className="inline-block size-2.5 rounded-[2px]"
            style={{ background: "var(--crimson)" }}
          />
          <span className="ml-1">More</span>
        </span>
      </figcaption>
    </figure>
  );
}
