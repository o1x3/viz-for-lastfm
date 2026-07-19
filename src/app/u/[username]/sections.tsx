import { getRecentAndLoved, getRotation, getStats } from "@/lib/data";
import type { Period } from "@/lib/lastfm/types";
import { OverviewBand, TrendSpark } from "@/components/dashboard/overview-band";
import { PlayShare } from "@/components/dashboard/play-share";
import { RecentTracks } from "@/components/dashboard/recent-tracks";
import { LovedTracks } from "@/components/dashboard/loved-tracks";
import { ListeningClock } from "@/components/charts/listening-clock";
import { WeekdayBars } from "@/components/charts/weekday-bars";
import { DayStrip } from "@/components/charts/day-strip";
import { TopArtists } from "@/components/dashboard/top-artists";
import { TopAlbums } from "@/components/dashboard/top-albums";
import { TopTracks } from "@/components/dashboard/top-tracks";

/**
 * Async server components streamed inside <Suspense> boundaries.
 * Fetchers return Result objects (they never throw), so a failed section
 * degrades to a quiet inline note instead of blowing up the page.
 */

function SectionError() {
  return (
    <p className="text-xs text-muted-foreground/70">Could not load this section.</p>
  );
}

/** 14-day trend sparkline for the now-playing strip; renders nothing on error. */
export async function TrendSlot({ username }: { username: string }) {
  const result = await getStats(username);
  if (!result.ok) return null;
  const stats = result.data;
  const endDay = Math.floor(stats.to / 86400);
  const isoOf = (d: number) => new Date(d * 86_400_000).toISOString().slice(0, 10);
  const data = Array.from({ length: 14 }, (_, i) => stats.byDay[isoOf(endDay - 13 + i)] ?? 0);
  return <TrendSpark data={data} total={stats.total} />;
}

/** Stat strip — 90-day numbers, streamed behind the masthead. */
export async function OverviewSection({ username }: { username: string }) {
  const result = await getStats(username);
  if (!result.ok) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <SectionError />
      </div>
    );
  }
  return <OverviewBand stats={result.data} />;
}

/** Rhythms charts — reuses the cached getStats()/getRotation() requests. */
export async function RhythmsBody({ username, period }: { username: string; period: Period }) {
  const [statsResult, rotationResult] = await Promise.all([
    getStats(username),
    getRotation(username, period),
  ]);
  if (!statsResult.ok) {
    return (
      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <SectionError />
      </div>
    );
  }
  const stats = statsResult.data;
  return (
    <>
      <div className="mt-4 flex flex-col gap-3">
        {/* daily plays (richest series) wide, weekday beside it */}
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5 lg:col-span-2">
            <DayStrip byDay={stats.byDay} from={stats.from} to={stats.to} />
          </div>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <WeekdayBars byWeekday={stats.byWeekday} />
          </div>
        </div>
        {/* the two circular charts, side by side */}
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <ListeningClock byHour={stats.byHour} />
          </div>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
            {rotationResult.ok ? (
              <PlayShare artists={rotationResult.data.topArtists} />
            ) : (
              <SectionError />
            )}
          </div>
        </div>
      </div>
      {stats.truncated && (
        <p className="mt-3 text-xs text-muted-foreground/70">
          Based on the most recent scrobbles.
        </p>
      )}
    </>
  );
}

/** Top charts toplists: three parallel Last.fm requests. */
export async function RotationBody({ username, period }: { username: string; period: Period }) {
  const result = await getRotation(username, period);
  if (!result.ok) {
    return (
      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <SectionError />
      </div>
    );
  }
  const { topArtists, topAlbums, topTracks } = result.data;
  return (
    <>
      <div className="mt-4">
        <TopArtists artists={topArtists} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <TopAlbums albums={topAlbums} />
        <TopTracks tracks={topTracks} />
      </div>
    </>
  );
}

/** Recent + loved: renders two grid columns inside the parent grid. */
export async function RecentAndLovedSection({ username }: { username: string }) {
  const result = await getRecentAndLoved(username);
  if (!result.ok) {
    return (
      <>
        <div className="rounded-lg border border-border bg-card p-4">
          <SectionError />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <SectionError />
        </div>
      </>
    );
  }
  return (
    <>
      <RecentTracks page={result.data.recent} />
      <LovedTracks tracks={result.data.loved} />
    </>
  );
}
