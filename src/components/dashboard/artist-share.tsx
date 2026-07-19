"use client";

import { useMemo } from "react";
import type { TopArtist } from "@/lib/lastfm/types";
import type { DitherColor } from "@/components/dither-kit";
import { BlockLegend, Pie, PieChart } from "@/components/dither-kit";

/**
 * Play-share donut — top five artists of the period as dithered slices,
 * everything below rank five bucketed into "Other".
 */

const SLICE_COLORS: DitherColor[] = ["red", "orange", "pink", "purple", "blue"];

export function ArtistShare({ artists }: { artists: TopArtist[] }) {
  const { rows, config, values } = useMemo(() => {
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
    const values = Object.fromEntries(rows.map((r) => [r.name, r.plays]));
    return { rows, config, values };
  }, [artists]);

  if (rows.length === 0) {
    return (
      <section className="rounded-lg border border-border bg-card p-5">
        <Header />
        <p className="text-xs text-muted-foreground">No plays in this period.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <Header />
      <PieChart
        data={rows}
        config={config}
        dataKey="plays"
        nameKey="name"
        innerRadius={0.62}
        className="h-52"
        bloom="low"
      >
        <Pie variant="gradient" />
      </PieChart>
      <BlockLegend config={config} values={values} className="mt-3" />
    </section>
  );
}

function Header() {
  return (
    <header className="mb-3 flex items-baseline justify-between">
      <h2 className="text-sm font-medium text-foreground">Play share</h2>
      <span className="font-mono text-xs tnum text-muted-foreground">top 5</span>
    </header>
  );
}
