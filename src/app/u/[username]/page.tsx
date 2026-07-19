import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getProfile } from "@/lib/data";
import { PERIODS, type Period } from "@/lib/lastfm/types";
import { DashHeader } from "@/components/dashboard/header";
import { NowPlaying } from "@/components/dashboard/now-playing";
import { PeriodSwitcher } from "@/components/dashboard/period-switcher";
import { DashFooter } from "@/components/dashboard/dash-footer";
import {
  OverviewSkeleton,
  RhythmsSkeleton,
  RotationSkeleton,
  TrackColumnSkeleton,
} from "@/components/dashboard/section-skeletons";
import {
  OverviewSection,
  RhythmsBody,
  RotationBody,
  RecentAndLovedSection,
} from "./sections";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return { title: `${decodeURIComponent(username)} · viz` };
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
    kicker: "Not found",
    title: "This user does not exist.",
    body: "Last.fm has no account under that name. Check the spelling and try again.",
    cta: "Back home",
  },
  "no-credentials": {
    kicker: "Not configured",
    title: "This deployment isn't set up yet.",
    body: "The server is missing its Last.fm API keys (LASTFM_API_KEY and LASTFM_SHARED_SECRET).",
    cta: "Back home",
  },
  "rate-limited": {
    kicker: "Rate limited",
    title: "Too many requests.",
    body: "Last.fm is rate limiting requests right now. Give it a minute and try again.",
    cta: "Back home",
  },
  upstream: {
    kicker: "Upstream error",
    title: "Last.fm didn't respond.",
    body: "Something went wrong fetching this user's data. It is usually brief; try again shortly.",
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
      <p className="text-xs text-muted-foreground">{copy.kicker}</p>
      <h1 className="mt-4 max-w-2xl text-balance text-2xl font-semibold tracking-tight md:text-3xl">
        {copy.title}
      </h1>
      <p className="mt-4 max-w-md text-balance text-sm leading-relaxed text-muted-foreground">
        {code === "user-not-found" ? (
          <>
            <span className="font-mono text-foreground">“{username}”</span>: {copy.body}
          </>
        ) : (
          copy.body
        )}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors duration-150 hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copy.cta}
      </Link>
    </main>
  );
}

function SectionHeading({
  title,
  description,
  id,
  children,
}: {
  title: string;
  description?: string;
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2
          id={id}
          className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground/70">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default async function DashboardPage({ params, searchParams }: PageProps) {
  const [{ username: rawUsername }, sp] = await Promise.all([params, searchParams]);
  const username = decodeURIComponent(rawUsername);
  const period = parsePeriod(sp.period);

  // Only the fast profile fetch (user info + one recent tracks page) blocks
  // the first flush. Everything below streams in via Suspense.
  const profile = await getProfile(username);
  if (!profile.ok) {
    return <ErrorState code={profile.error} username={username} />;
  }
  const { info, recent, isOwner, isDemo } = profile.data;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 font-mono md:px-10">
      <DashHeader info={info} isOwner={isOwner} isDemo={isDemo} />

      <NowPlaying initial={recent.tracks[0] ?? null} isOwner={isOwner} />

      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewSection username={username} period={period} />
      </Suspense>

      {/* Rhythms: when the listening happens */}
      <section aria-labelledby="rhythms-heading" className="mt-10">
        <SectionHeading title="Rhythms" description="Last 90 days" id="rhythms-heading" />
        <Suspense fallback={<RhythmsSkeleton />}>
          <RhythmsBody username={username} />
        </Suspense>
      </section>

      {/* Top: the charts */}
      <section aria-labelledby="rotation-heading" className="mt-10">
        <SectionHeading
          title="Top"
          description="Most played artists, albums, and tracks"
          id="rotation-heading"
        >
          <PeriodSwitcher current={period} />
        </SectionHeading>
        <Suspense fallback={<RotationSkeleton />}>
          <RotationBody username={username} period={period} />
        </Suspense>
      </section>

      {/* Recent + loved */}
      <div className="mt-10 grid gap-3 lg:grid-cols-2">
        <Suspense
          fallback={
            <>
              <TrackColumnSkeleton />
              <TrackColumnSkeleton />
            </>
          }
        >
          <RecentAndLovedSection username={username} />
        </Suspense>
      </div>

      <DashFooter isDemo={isDemo} />
    </main>
  );
}
