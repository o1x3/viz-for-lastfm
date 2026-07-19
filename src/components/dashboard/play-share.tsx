"use client";

import { useMemo } from "react";
import type { TopArtist } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";
import type { DitherColor } from "@/components/dither-kit";
import { Pie, PieChart } from "@/components/dither-kit";
import { PALETTE, rgb } from "@/components/dither-kit/palette";

/**
 * Play-share donut — top five artists of the period plus an "Other" bucket.
 * The legend doubles as the caption line below the chart, matching the
 * peak-readout grammar of the neighboring chart panels.
 */

const SLICE_COLORS: DitherColor[] = ["red", "orange", "pink", "purple", "blue"];

export function PlayShare({ artists }: { artists: TopArtist[] }) {
  const share = useMemo(() => {
    if (artists.length === 0) return null;
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

  if (!share) {
    return <p className="text-xs text-muted-foreground">No plays in this period.</p>;
  }

  return (
    <figure className="w-full">
      <p className="mb-2 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Play share · top 5
      </p>
      <div
        role="img"
        aria-label={`Play share of the top five artists: ${share.rows
          .map((r) => `${r.name} ${formatNumber(r.plays)} plays`)
          .join(", ")}.`}
      >
        <PieChart
          data={share.rows}
          config={share.config}
          dataKey="plays"
          nameKey="name"
          innerRadius={0.62}
          className="h-56"
          bloom="low"
        >
          <Pie variant="gradient" />
        </PieChart>
      </div>

      {/* the index — legend disguised as the caption line */}
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {share.rows.map((r) => (
          <span key={r.name} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2 flex-none rounded-[2px]"
              style={{ background: rgb(PALETTE[share.config[r.name].color].fill) }}
            />
            <span className="max-w-32 truncate">{r.name}</span>
            <span className="tnum font-semibold text-foreground">{formatNumber(r.plays)}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
