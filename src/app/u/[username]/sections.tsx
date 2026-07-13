import { getRecentAndLoved, getRotation, getStats } from "@/lib/data";
import type { Period } from "@/lib/lastfm/types";
import { StatTiles } from "@/components/dashboard/stat-tiles";
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
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
      could not load this section
    </p>
  );
}

/** Stat band — needs the slow 90-day stats, so it streams in behind the masthead. */
export async function StatsBand({ username }: { username: string }) {
  const result = await getStats(username);
  if (!result.ok) {
    return (
      <div className="border-y border-border py-8">
        <SectionError />
      </div>
    );
  }
  return <StatTiles stats={result.data} />;
}

/** Rhythms charts — shares the getStats() request with StatsBand via React cache. */
export async function RhythmsBody({ username }: { username: string }) {
  const result = await getStats(username);
  if (!result.ok) {
    return (
      <div className="mt-8">
        <SectionError />
      </div>
    );
  }
  const stats = result.data;
  return (
    <>
      <div className="mt-8 grid gap-10 lg:grid-cols-5 lg:gap-12">
        <div className="lg:col-span-3">
          <ListeningClock byHour={stats.byHour} />
        </div>
        <div className="flex flex-col gap-10 lg:col-span-2">
          <WeekdayBars byWeekday={stats.byWeekday} />
          <DayStrip byDay={stats.byDay} from={stats.from} to={stats.to} />
        </div>
      </div>
      {stats.truncated && (
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
          based on the most recent scrobbles
        </p>
      )}
    </>
  );
}

/** On Rotation toplists — three parallel Last.fm requests. */
export async function RotationBody({ username, period }: { username: string; period: Period }) {
  const result = await getRotation(username, period);
  if (!result.ok) {
    return (
      <div className="mt-8">
        <SectionError />
      </div>
    );
  }
  const { topArtists, topAlbums, topTracks } = result.data;
  return (
    <>
      <div className="mt-8">
        <TopArtists artists={topArtists} />
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <TopAlbums albums={topAlbums} />
        <TopTracks tracks={topTracks} />
      </div>
    </>
  );
}

/** The log + loved — renders two grid columns inside the parent grid. */
export async function RecentAndLovedSection({ username }: { username: string }) {
  const result = await getRecentAndLoved(username);
  if (!result.ok) {
    return (
      <>
        <div className="border-t border-border pt-4">
          <SectionError />
        </div>
        <div className="border-t border-border pt-4">
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
