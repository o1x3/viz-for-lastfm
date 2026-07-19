import { getRecentAndLoved, getRotation, getStats } from "@/lib/data";
import type { Period } from "@/lib/lastfm/types";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { RecentTracks } from "@/components/dashboard/recent-tracks";
import { LovedTracks } from "@/components/dashboard/loved-tracks";
import { ListeningClock } from "@/components/charts/listening-clock";
import { WeekdayBars } from "@/components/charts/weekday-bars";
import { DayStrip } from "@/components/charts/day-strip";
import { TopArtists } from "@/components/dashboard/top-artists";
import { ArtistShare } from "@/components/dashboard/artist-share";
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

/** Stat tiles: need the slow 90 day stats, so they stream in behind the masthead. */
export async function StatsBand({ username }: { username: string }) {
  const result = await getStats(username);
  if (!result.ok) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <SectionError />
      </div>
    );
  }
  return <StatTiles stats={result.data} />;
}

/** Play-share donut — shares the getRotation() request with RotationBody via React cache. */
export async function ShareSection({ username, period }: { username: string; period: Period }) {
  const result = await getRotation(username, period);
  if (!result.ok) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <SectionError />
      </div>
    );
  }
  return <ArtistShare artists={result.data.topArtists} />;
}

/** Rhythms charts — shares the getStats() request with StatsBand via React cache. */
export async function RhythmsBody({ username }: { username: string }) {
  const result = await getStats(username);
  if (!result.ok) {
    return (
      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <SectionError />
      </div>
    );
  }
  const stats = result.data;
  return (
    <>
      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-4 sm:p-5 lg:col-span-3">
          <ListeningClock byHour={stats.byHour} />
        </div>
        <div className="flex flex-col gap-3 lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <WeekdayBars byWeekday={stats.byWeekday} />
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card p-4 sm:p-5">
            <DayStrip byDay={stats.byDay} from={stats.from} to={stats.to} />
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
