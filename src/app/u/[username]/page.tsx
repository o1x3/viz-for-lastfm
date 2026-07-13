import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardData } from "@/lib/data";
import { PERIODS, type Period } from "@/lib/lastfm/types";
import { DashHeader } from "@/components/dashboard/header";
import { NowPlaying } from "@/components/dashboard/now-playing";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { PeriodSwitcher } from "@/components/dashboard/period-switcher";
import { RecentTracks } from "@/components/dashboard/recent-tracks";
import { DashFooter } from "@/components/dashboard/dash-footer";
// Built by sibling agents — imported per contract.
import { ListeningClock } from "@/components/charts/listening-clock";
import { WeekdayBars } from "@/components/charts/weekday-bars";
import { DayStrip } from "@/components/charts/day-strip";
import { TopArtists } from "@/components/dashboard/top-artists";
import { TopAlbums } from "@/components/dashboard/top-albums";
import { TopTracks } from "@/components/dashboard/top-tracks";
import { LovedTracks } from "@/components/dashboard/loved-tracks";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return { title: `${decodeURIComponent(username)} · Sleeve` };
}

function parsePeriod(raw: string | string[] | undefined): Period {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return PERIODS.some((p) => p.value === value) ? (value as Period) : "1month";
}

const ERROR_COPY: Record<
  "no-credentials" | "user-not-found" | "rate-limited" | "upstream",
  { kicker: string; title: string; body: string; cta: string }
> = {
  "user-not-found": {
    kicker: "no record found",
    title: "This listener does not exist.",
    body: "We dug through the crates twice — Last.fm has no one filed under that name.",
    cta: "Back to the front sleeve",
  },
  "no-credentials": {
    kicker: "no key on file",
    title: "Connect your Last.fm first.",
    body: "Sleeve is bring-your-own-API-key: nothing is stored server-side, so we need your key before we can read the grooves.",
    cta: "Go home and connect",
  },
  "rate-limited": {
    kicker: "too many spins",
    title: "The needle needs a rest.",
    body: "Last.fm is rate-limiting requests right now. Give it a minute, then drop the needle again.",
    cta: "Back home",
  },
  upstream: {
    kicker: "skipped a groove",
    title: "Last.fm missed a beat.",
    body: "Something went wrong upstream while fetching this listener's records. It is usually brief — try again shortly.",
    cta: "Back home",
  },
};

function ErrorState({
  code,
  username,
}: {
  code: keyof typeof ERROR_COPY;
  username: string;
}) {
  const copy = ERROR_COPY[code];
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
        {copy.kicker}
      </p>
      <h1 className="mt-6 max-w-2xl text-balance font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
        {copy.title}
      </h1>
      <p className="mt-6 max-w-md text-balance text-sm leading-relaxed text-muted-foreground">
        {code === "user-not-found" ? (
          <>
            <span className="font-mono text-foreground">“{username}”</span> — {copy.body}
          </>
        ) : (
          copy.body
        )}
      </p>
      <Link
        href="/"
        className="mt-10 border-b border-primary pb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copy.cta}
      </Link>
    </main>
  );
}

function SectionHeading({
  kicker,
  title,
  id,
  children,
}: {
  kicker: string;
  title: string;
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {kicker}
        </p>
        <h2 id={id} className="mt-1 font-display text-3xl tracking-tight md:text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export default async function DashboardPage({ params, searchParams }: PageProps) {
  const [{ username: rawUsername }, sp] = await Promise.all([params, searchParams]);
  const username = decodeURIComponent(rawUsername);
  const period = parsePeriod(sp.period);

  const result = await getDashboardData(username, period);
  if (!result.ok) {
    return <ErrorState code={result.error} username={username} />;
  }
  const { data } = result;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 md:px-10">
      <DashHeader info={data.info} isOwner={data.isOwner} isDemo={data.isDemo} />

      <NowPlaying initial={data.recent.tracks[0] ?? null} isOwner={data.isOwner} />

      <div className="mt-10">
        <StatTiles info={data.info} stats={data.stats} />
      </div>

      {/* Rhythms — when the listening happens */}
      <section aria-labelledby="rhythms-heading" className="mt-16">
        <SectionHeading kicker="the last 90 days" title="Rhythms" id="rhythms-heading" />
        <div className="mt-8 grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <ListeningClock byHour={data.stats.byHour} />
          </div>
          <div className="flex flex-col gap-10 lg:col-span-2">
            <WeekdayBars byWeekday={data.stats.byWeekday} />
            <DayStrip byDay={data.stats.byDay} from={data.stats.from} to={data.stats.to} />
          </div>
        </div>
        {data.stats.truncated && (
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
            based on the most recent scrobbles
          </p>
        )}
      </section>

      {/* On rotation — the charts */}
      <section aria-labelledby="rotation-heading" className="mt-16">
        <SectionHeading kicker="heavy rotation" title="On rotation" id="rotation-heading">
          <PeriodSwitcher current={period} />
        </SectionHeading>
        <div className="mt-8">
          <TopArtists artists={data.topArtists} />
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <TopAlbums albums={data.topAlbums} />
          <TopTracks tracks={data.topTracks} />
        </div>
      </section>

      {/* The log + loved */}
      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <RecentTracks page={data.recent} />
        <LovedTracks tracks={data.loved} />
      </div>

      <DashFooter isDemo={data.isDemo} />
    </main>
  );
}
