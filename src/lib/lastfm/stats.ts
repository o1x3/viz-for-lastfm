import "server-only";
import { unstable_cache } from "next/cache";
import { getRecentTracks, type Credentials } from "./client";
import type { ListeningStats } from "./types";

const PAGE_SIZE = 200;
/** Hard cap on API pages per stats computation (~6k scrobbles ≈ 2 months for heavy listeners). */
const MAX_PAGES = 30;
/** Pages fetched concurrently after page 1 reveals the total. */
const BATCH_SIZE = 5;
/** Analyze the last 90 days. */
const WINDOW_DAYS = 90;

function dayKey(unix: number): string {
  return new Date(unix * 1000).toISOString().slice(0, 10);
}

async function computeStats(creds: Credentials, user: string, now: number): Promise<ListeningStats> {
  const to = now;
  const from = to - WINDOW_DAYS * 86400;

  const byHour = new Array(24).fill(0) as number[];
  const byWeekday = new Array(7).fill(0) as number[];
  const byDay: Record<string, number> = {};
  const artists = new Set<string>();
  const tracks = new Set<string>();
  let total = 0;

  const fetchPage = (page: number) =>
    getRecentTracks(creds, user, { limit: PAGE_SIZE, page, from, to, revalidate: 900 });

  const ingest = (res: Awaited<ReturnType<typeof getRecentTracks>>) => {
    for (const t of res.tracks) {
      if (t.nowPlaying || !t.date) continue;
      const d = new Date(t.date * 1000);
      byHour[d.getUTCHours()]++;
      byWeekday[d.getUTCDay()]++;
      const key = dayKey(t.date);
      byDay[key] = (byDay[key] ?? 0) + 1;
      artists.add(t.artist.toLowerCase());
      tracks.add(`${t.artist}|${t.name}`.toLowerCase());
      total++;
    }
  };

  // Page 1 reveals totalPages; fetch the rest in parallel batches.
  const first = await fetchPage(1);
  ingest(first);
  const totalPages = first.totalPages || 1;
  const lastPage = Math.min(totalPages, MAX_PAGES);
  const truncated = totalPages > MAX_PAGES;
  for (let start = 2; start <= lastPage; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE - 1, lastPage);
    const batch: Array<ReturnType<typeof fetchPage>> = [];
    for (let p = start; p <= end; p++) batch.push(fetchPage(p));
    for (const res of await Promise.all(batch)) ingest(res);
  }

  // Streaks over the window (consecutive days with >=1 play).
  let longest = 0;
  let current = 0;
  let run = 0;
  for (let i = WINDOW_DAYS; i >= 0; i--) {
    const key = dayKey(to - i * 86400);
    if (byDay[key]) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }
  // Current streak: count back from today (allow today to be empty so far).
  for (let i = 0; i <= WINDOW_DAYS; i++) {
    const key = dayKey(to - i * 86400);
    if (byDay[key]) current++;
    else if (i === 0) continue;
    else break;
  }

  return {
    byHour,
    byWeekday,
    byDay,
    total,
    uniqueArtists: artists.size,
    uniqueTracks: tracks.size,
    longestStreakDays: longest,
    currentStreakDays: current,
    from,
    to,
    truncated,
  };
}

/**
 * Listening stats for the last 90 days, cached for 30 minutes per user.
 * Heavy: paginates recent tracks (up to MAX_PAGES requests on first compute).
 */
export async function getListeningStats(creds: Credentials, user: string): Promise<ListeningStats> {
  // Bucket "now" to 30 minute steps so the cache key is stable within the TTL.
  const bucket = Math.floor(Date.now() / 1000 / 1800) * 1800;
  const cached = unstable_cache(
    (u: string, n: number) => computeStats(creds, u, n),
    ["listening-stats", creds.apiKey.slice(0, 8), user.toLowerCase()],
    { revalidate: 1800 },
  );
  return cached(user, bucket);
}
