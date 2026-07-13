import { formatNumber } from "@/lib/format";

/**
 * Radial "listening clock" — 24 wedges around a spindle, like a clock face
 * crossed with a vinyl record. Wedge radius encodes plays per hour on a
 * sqrt scale (area honesty). Peak hour in crimson; everything else cream ink
 * at graded opacity. Pure server-safe SVG, no hooks.
 */

const CX = 160;
const CY = 160;
const R_INNER = 44; // spindle label area
const R_MAX = 126; // tallest wedge
const R_RING = 138; // outer groove ring
const R_TICK_IN = 132;
const R_LABEL = 150;
const GAP_DEG = 2.5; // angular gap between wedges

const f = (n: number) => Number(n.toFixed(2));

function polar(r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [f(CX + r * Math.cos(rad)), f(CY + r * Math.sin(rad))];
}

function wedgePath(r0: number, r1: number, a0: number, a1: number): string {
  const [x0, y0] = polar(r1, a0);
  const [x1, y1] = polar(r1, a1);
  const [x2, y2] = polar(r0, a1);
  const [x3, y3] = polar(r0, a0);
  return `M ${x0} ${y0} A ${f(r1)} ${f(r1)} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${f(r0)} ${f(r0)} 0 0 0 ${x3} ${y3} Z`;
}

const pad2 = (h: number) => String(h).padStart(2, "0");

export function ListeningClock({ byHour }: { byHour: number[] }) {
  const hours = Array.from({ length: 24 }, (_, h) => byHour[h] ?? 0);
  const total = hours.reduce((a, b) => a + b, 0);
  const max = Math.max(...hours);
  const peakHour = hours.indexOf(max);

  const label =
    total > 0
      ? `Listening clock. ${formatNumber(total)} plays across 24 hours. Peak hour ${pad2(peakHour)}:00 with ${formatNumber(max)} plays.`
      : "Listening clock. No plays recorded in this period.";

  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 320 320"
        role="img"
        aria-label={label}
        className="block w-full h-auto"
      >
        {/* outer groove ring */}
        <circle cx={CX} cy={CY} r={R_RING} fill="none" stroke="var(--border)" strokeWidth={1} />
        {/* inner groove around the spindle */}
        <circle cx={CX} cy={CY} r={R_INNER - 4} fill="none" stroke="var(--border)" strokeWidth={1} />

        {/* hour ticks on the outer ring */}
        {hours.map((_, h) => {
          const major = h % 6 === 0;
          const a = h * 15;
          const [x0, y0] = polar(major ? R_TICK_IN : R_RING - 3, a);
          const [x1, y1] = polar(R_RING, a);
          return (
            <line
              key={`tick-${h}`}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke={major ? "var(--cream)" : "var(--border)"}
              strokeOpacity={major ? 0.5 : 1}
              strokeWidth={1}
            />
          );
        })}

        {/* cardinal hour labels */}
        {[0, 6, 12, 18].map((h) => {
          const [x, y] = polar(R_LABEL, h * 15);
          return (
            <text
              key={`label-${h}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--muted-foreground)"
              fontFamily="var(--font-spline-mono), monospace"
              fontSize={9}
              letterSpacing="0.15em"
            >
              {pad2(h)}
            </text>
          );
        })}

        {/* wedges */}
        {max > 0 &&
          hours.map((v, h) => {
            if (v <= 0) return null;
            const r1 = R_INNER + (R_MAX - R_INNER) * Math.sqrt(v / max);
            const a0 = h * 15 + GAP_DEG / 2;
            const a1 = (h + 1) * 15 - GAP_DEG / 2;
            const isPeak = h === peakHour;
            return (
              <path
                key={`wedge-${h}`}
                d={wedgePath(R_INNER, r1, a0, a1)}
                fill={isPeak ? "var(--crimson)" : "var(--cream)"}
                fillOpacity={isPeak ? 0.95 : f(0.2 + 0.55 * (v / max))}
              >
                <title>{`${pad2(h)}:00–${pad2((h + 1) % 24)}:00 · ${formatNumber(v)} plays`}</title>
              </path>
            );
          })}

        {/* record spindle */}
        <circle cx={CX} cy={CY} r={7} fill="none" stroke="var(--border)" strokeWidth={1} />
        <circle cx={CX} cy={CY} r={2.5} fill="var(--cream)" fillOpacity={0.9} />
      </svg>

      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground tnum">
        {total > 0 ? (
          <>
            Peak hour{" "}
            <span className="text-foreground">{pad2(peakHour)}:00</span> ·{" "}
            {formatNumber(total)} plays
          </>
        ) : (
          <>No plays this period</>
        )}
      </figcaption>
    </figure>
  );
}
