import "server-only";
import { cache } from "react";
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

export type SectionError = "no-credentials" | "user-not-found" | "rate-limited" | "upstream";

export type SectionResult<T> = { ok: true; data: T } | { ok: false; error: SectionError };

type CredContext =
  | { mode: "demo" }
  | { mode: "missing" }
  | { mode: "real"; creds: Credentials; isOwner: boolean };

/**
 * Resolve demo-vs-real credentials once per request (React cache) so every
 * granular fetcher agrees on the mode. Username "demo" without a session
 * always serves the baked-in demo dataset.
 */
const resolveCreds = cache(async (username: string): Promise<CredContext> => {
  const session = await getSession();
  if (username.toLowerCase() === DEMO_USERNAME && !session) return { mode: "demo" };

  const creds: Credentials | null = session
    ? { apiKey: session.apiKey, apiSecret: session.apiSecret, sessionKey: session.sessionKey }
    : envCredentials();
  if (!creds) return { mode: "missing" };

  return {
    mode: "real",
    creds,
    isOwner: session?.username.toLowerCase() === username.toLowerCase(),
  };
});

function mapError(e: unknown): { ok: false; error: SectionError } {
  if (e instanceof LastfmError) {
    if (e.code === 6) return { ok: false, error: "user-not-found" };
    if (e.code === 29) return { ok: false, error: "rate-limited" };
  }
  return { ok: false, error: "upstream" };
}

export interface Profile {
  info: UserInfo;
  /** First page of recent tracks — powers the NowPlaying bar; one cheap request. */
  recent: RecentTracksPage;
  /** viewer is the authenticated owner of this profile */
  isOwner: boolean;
  isDemo: boolean;
}

/** Fast: user info + first recent-tracks page. Blocks the page shell. */
export const getProfile = cache(async (username: string): Promise<SectionResult<Profile>> => {
  const ctx = await resolveCreds(username);
  if (ctx.mode === "demo") {
    return {
      ok: true,
      data: { info: demoUserInfo(), recent: demoRecentTracks(20), isOwner: false, isDemo: true },
    };
  }
  if (ctx.mode === "missing") return { ok: false, error: "no-credentials" };
  try {
    const [info, recent] = await Promise.all([
      getUserInfo(ctx.creds, username),
      getRecentTracks(ctx.creds, username, { limit: 20 }),
    ]);
    return { ok: true, data: { info, recent, isOwner: ctx.isOwner, isDemo: false } };
  } catch (e) {
    return mapError(e);
  }
});

export interface Rotation {
  topArtists: TopArtist[];
  topAlbums: TopAlbum[];
  topTracks: TopTrack[];
}

/** Top artists/albums/tracks for a period, fetched in parallel. */
export const getRotation = cache(
  async (username: string, period: Period): Promise<SectionResult<Rotation>> => {
    const ctx = await resolveCreds(username);
    if (ctx.mode === "demo") {
      return {
        ok: true,
        data: {
          topArtists: demoTopArtists(period),
          topAlbums: demoTopAlbums(period),
          topTracks: demoTopTracks(period),
        },
      };
    }
    if (ctx.mode === "missing") return { ok: false, error: "no-credentials" };
    try {
      const [topArtists, topAlbums, topTracks] = await Promise.all([
        getTopArtists(ctx.creds, username, period),
        getTopAlbums(ctx.creds, username, period),
        getTopTracks(ctx.creds, username, period),
      ]);
      return { ok: true, data: { topArtists, topAlbums, topTracks } };
    } catch (e) {
      return mapError(e);
    }
  },
);

export interface RecentAndLoved {
  recent: RecentTracksPage;
  loved: LovedTrack[];
}

/**
 * Recent log + loved tracks. The recent-tracks request matches getProfile's
 * (same URL + options), so Next's fetch memoization dedupes it per render.
 */
export const getRecentAndLoved = cache(
  async (username: string): Promise<SectionResult<RecentAndLoved>> => {
    const ctx = await resolveCreds(username);
    if (ctx.mode === "demo") {
      return { ok: true, data: { recent: demoRecentTracks(20), loved: demoLovedTracks(8) } };
    }
    if (ctx.mode === "missing") return { ok: false, error: "no-credentials" };
    try {
      const [recent, loved] = await Promise.all([
        getRecentTracks(ctx.creds, username, { limit: 20 }),
        getLovedTracks(ctx.creds, username, 8),
      ]);
      return { ok: true, data: { recent, loved } };
    } catch (e) {
      return mapError(e);
    }
  },
);

/** Heavy: 90-day listening stats (paginated). Shared by the stat band and Rhythms. */
export const getStats = cache(async (username: string): Promise<SectionResult<ListeningStats>> => {
  const ctx = await resolveCreds(username);
  if (ctx.mode === "demo") return { ok: true, data: demoStats() };
  if (ctx.mode === "missing") return { ok: false, error: "no-credentials" };
  try {
    return { ok: true, data: await getListeningStats(ctx.creds, username) };
  } catch (e) {
    return mapError(e);
  }
});
