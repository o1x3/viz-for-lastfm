import "server-only";
import {
  envCredentials,
  getLovedTracks,
  getRecentTracks,
  getTopAlbums,
  getTopArtists,
  getTopTracks,
  getUserInfo,
  LastfmError,
  type Credentials,
} from "./lastfm/client";
import { getListeningStats } from "./lastfm/stats";
import {
  DEMO_USERNAME,
  demoLovedTracks,
  demoRecentTracks,
  demoStats,
  demoTopAlbums,
  demoTopArtists,
  demoTopTracks,
  demoUserInfo,
} from "./lastfm/demo";
import type {
  ListeningStats,
  LovedTrack,
  Period,
  RecentTracksPage,
  TopAlbum,
  TopArtist,
  TopTrack,
  UserInfo,
} from "./lastfm/types";
import { getSession } from "./session";

export interface DashboardData {
  info: UserInfo;
  topArtists: TopArtist[];
  topAlbums: TopAlbum[];
  topTracks: TopTrack[];
  recent: RecentTracksPage;
  loved: LovedTrack[];
  stats: ListeningStats;
  /** viewer is the authenticated owner of this profile */
  isOwner: boolean;
  isDemo: boolean;
}

export type DashboardResult =
  | { ok: true; data: DashboardData }
  | { ok: false; error: "no-credentials" | "user-not-found" | "rate-limited" | "upstream" };

/**
 * All data for a user's dashboard, fetched in parallel.
 * Falls back to the baked-in demo dataset for username "demo" when
 * no credentials are available.
 */
export async function getDashboardData(username: string, period: Period): Promise<DashboardResult> {
  const session = await getSession();
  const creds: Credentials | null = session
    ? { apiKey: session.apiKey, apiSecret: session.apiSecret, sessionKey: session.sessionKey }
    : envCredentials();

  const isDemo = username.toLowerCase() === DEMO_USERNAME && !creds;
  if (isDemo || (username.toLowerCase() === DEMO_USERNAME && !session)) {
    return {
      ok: true,
      data: {
        info: demoUserInfo(),
        topArtists: demoTopArtists(period),
        topAlbums: demoTopAlbums(period),
        topTracks: demoTopTracks(period),
        recent: demoRecentTracks(20),
        loved: demoLovedTracks(8),
        stats: demoStats(),
        isOwner: false,
        isDemo: true,
      },
    };
  }

  if (!creds) return { ok: false, error: "no-credentials" };

  try {
    const [info, topArtists, topAlbums, topTracks, recent, loved, stats] = await Promise.all([
      getUserInfo(creds, username),
      getTopArtists(creds, username, period),
      getTopAlbums(creds, username, period),
      getTopTracks(creds, username, period),
      getRecentTracks(creds, username, { limit: 20 }),
      getLovedTracks(creds, username, 8),
      getListeningStats(creds, username),
    ]);
    return {
      ok: true,
      data: {
        info,
        topArtists,
        topAlbums,
        topTracks,
        recent,
        loved,
        stats,
        isOwner: session?.username.toLowerCase() === username.toLowerCase(),
        isDemo: false,
      },
    };
  } catch (e) {
    if (e instanceof LastfmError) {
      if (e.code === 6) return { ok: false, error: "user-not-found" };
      if (e.code === 29) return { ok: false, error: "rate-limited" };
    }
    return { ok: false, error: "upstream" };
  }
}
