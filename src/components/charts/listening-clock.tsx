import { formatNumber } from "@/lib/format";

/**
 * Radial "listening clock": 24 wedges around a small center circle. Wedge
 * radius encodes plays per hour on a sqrt scale (area honesty). Peak hour in
 * red; everything else on a gray ladder. Pure server-safe SVG, no hooks.
 */

const CX = 160;
const CY = 160;
const R_INNER = 28; // small center circle
const R_MAX = 130; // tallest wedge
const R_LABEL = 146;
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

/** Gray ladder: brighter for busier hours. */
function grayTone(t: number): string {
  if (t >= 0.75) return "var(--chart-2)";
  if (t >= 0.5) return "var(--chart-3)";
  if (t >= 0.25) return "var(--chart-4)";
  return "var(--chart-5)";
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
        viewBox="-8 -8 336 336"
        role="img"
        aria-label={label}
        className="block w-full h-auto"
      >
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
              fontFamily="var(--font-geist-mono), monospace"
              fontSize={10}
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
                fill={isPeak ? "var(--chart-1)" : grayTone(v / max)}
              >
                <title>{`${pad2(h)}:00–${pad2((h + 1) % 24)}:00 · ${formatNumber(v)} plays`}</title>
              </path>
            );
          })}

        {/* small center circle */}
        <circle cx={CX} cy={CY} r={3} fill="var(--chart-4)" />
      </svg>

      <figcaption className="mt-3 text-xs text-muted-foreground">
        {total > 0 ? (
          <>
            Peak hour{" "}
            <span className="font-mono tnum text-foreground">
              {pad2(peakHour)}:00
            </span>{" "}
            · <span className="font-mono tnum">{formatNumber(total)}</span>{" "}
            plays
          </>
        ) : (
          <>No plays this period</>
        )}
      </figcaption>
    </figure>
  );
}
