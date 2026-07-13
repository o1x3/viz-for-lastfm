import "server-only";
import { createHash } from "node:crypto";
import type {
  LovedTrack,
  Period,
  RecentTrack,
  RecentTracksPage,
  TopAlbum,
  TopArtist,
  TopTrack,
  UserInfo,
} from "./types";

const API_ROOT = "https://ws.audioscrobbler.com/2.0/";

export class LastfmError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message);
    this.name = "LastfmError";
  }
}

export interface Credentials {
  apiKey: string;
  apiSecret?: string;
  sessionKey?: string;
}

/** Credentials the deployer can bake in so visitors don't need their own key. */
export function envCredentials(): Credentials | null {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) return null;
  return { apiKey, apiSecret: process.env.LASTFM_SHARED_SECRET };
}

/**
 * api_sig = md5 of all params (sorted by name, name+value concatenated)
 * followed by the shared secret. `format` and `callback` are excluded.
 */
function sign(params: Record<string, string>, secret: string): string {
  const base = Object.keys(params)
    .filter((k) => k !== "format" && k !== "callback")
    .sort()
    .map((k) => k + params[k])
    .join("");
  return createHash("md5").update(base + secret, "utf8").digest("hex");
}

async function call<T>(
  params: Record<string, string>,
  opts: { signed?: boolean; secret?: string; revalidate?: number } = {},
): Promise<T> {
  const p: Record<string, string> = { ...params, format: "json" };
  if (opts.signed) {
    if (!opts.secret) throw new LastfmError("API secret required for signed call", 0);
    p.api_sig = sign(p, opts.secret);
  }
  const url = API_ROOT + "?" + new URLSearchParams(p).toString();
  const res = await fetch(url, {
    headers: { "User-Agent": "vinyl-lastfm-dashboard/1.0" },
    // Signed calls (auth) must never be cached; public reads cache briefly.
    ...(opts.signed
      ? { cache: "no-store" as const }
      : { next: { revalidate: opts.revalidate ?? 300 } }),
  });
  const data = await res.json();
  if (data.error) {
    throw new LastfmError(data.message ?? "Last.fm error", data.error);
  }
  return data as T;
}

// ---------- helpers to normalize raw API shapes ----------

type RawImage = { size: string; "#text": string };

/** Last.fm returns a known placeholder star for missing art — treat it as null. */
const PLACEHOLDER_HASH = "2a96cbd8b46e442fc41c2b86b821562f";

function bestImage(images: RawImage[] | undefined): string | null {
  if (!images?.length) return null;
  const preferred =
    images.find((i) => i.size === "extralarge") ??
    images.find((i) => i.size === "large") ??
    images[images.length - 1];
  const url = preferred?.["#text"] ?? "";
  if (!url || url.includes(PLACEHOLDER_HASH)) return null;
  return url;
}

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Last.fm returns a bare object (not a 1-element array) when a list has a single item. */
function asArray<T>(v: T | T[] | undefined | null): T[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

// ---------- auth ----------

export function authUrl(apiKey: string, callbackUrl: string): string {
  return `https://www.last.fm/api/auth/?api_key=${encodeURIComponent(apiKey)}&cb=${encodeURIComponent(callbackUrl)}`;
}

export async function getSession(
  creds: Required<Pick<Credentials, "apiKey" | "apiSecret">>,
  token: string,
): Promise<{ name: string; key: string }> {
  const data = await call<{ session: { name: string; key: string } }>(
    { method: "auth.getSession", api_key: creds.apiKey, token },
    { signed: true, secret: creds.apiSecret },
  );
  return data.session;
}

// ---------- user reads (public endpoints) ----------

export async function getUserInfo(creds: Credentials, user: string): Promise<UserInfo> {
  const data = await call<{ user: Record<string, unknown> }>(
    { method: "user.getInfo", api_key: creds.apiKey, user },
    { revalidate: 300 },
  );
  const u = data.user as {
    name: string;
    realname?: string;
    url: string;
    country?: string;
    playcount: string;
    artist_count?: string;
    album_count?: string;
    track_count?: string;
    registered: { unixtime: string };
    image?: RawImage[];
    subscriber?: string;
  };
  return {
    name: u.name,
    realname: u.realname ?? "",
    url: u.url,
    country: u.country ?? "",
    playcount: num(u.playcount),
    artistCount: num(u.artist_count),
    albumCount: num(u.album_count),
    trackCount: num(u.track_count),
    registered: num(u.registered?.unixtime),
    avatar: bestImage(u.image),
    subscriber: u.subscriber === "1",
  };
}

export async function getTopArtists(
  creds: Credentials,
  user: string,
  period: Period,
  limit = 12,
): Promise<TopArtist[]> {
  const data = await call<{ topartists: { artist: Array<Record<string, unknown>> | Record<string, unknown> } }>(
    { method: "user.getTopArtists", api_key: creds.apiKey, user, period, limit: String(limit) },
    { revalidate: 900 },
  );
  return asArray(data.topartists?.artist).map((a) => {
    const r = a as { name: string; url: string; playcount: string; mbid?: string; "@attr"?: { rank: string } };
    return {
      name: r.name,
      url: r.url,
      playcount: num(r.playcount),
      rank: num(r["@attr"]?.rank),
      mbid: r.mbid ?? "",
    };
  });
}

export async function getTopAlbums(
  creds: Credentials,
  user: string,
  period: Period,
  limit = 12,
): Promise<TopAlbum[]> {
  const data = await call<{ topalbums: { album: Array<Record<string, unknown>> | Record<string, unknown> } }>(
    { method: "user.getTopAlbums", api_key: creds.apiKey, user, period, limit: String(limit) },
    { revalidate: 900 },
  );
  return asArray(data.topalbums?.album).map((a) => {
    const r = a as {
      name: string;
      url: string;
      playcount: string;
      artist: { name: string };
      image?: RawImage[];
      "@attr"?: { rank: string };
    };
    return {
      name: r.name,
      artist: r.artist?.name ?? "",
      url: r.url,
      playcount: num(r.playcount),
      rank: num(r["@attr"]?.rank),
      image: bestImage(r.image),
    };
  });
}

export async function getTopTracks(
  creds: Credentials,
  user: string,
  period: Period,
  limit = 12,
): Promise<TopTrack[]> {
  const data = await call<{ toptracks: { track: Array<Record<string, unknown>> | Record<string, unknown> } }>(
    { method: "user.getTopTracks", api_key: creds.apiKey, user, period, limit: String(limit) },
    { revalidate: 900 },
  );
  return asArray(data.toptracks?.track).map((t) => {
    const r = t as {
      name: string;
      url: string;
      playcount: string;
      duration?: string;
      artist: { name: string };
      image?: RawImage[];
      "@attr"?: { rank: string };
    };
    return {
      name: r.name,
      artist: r.artist?.name ?? "",
      url: r.url,
      playcount: num(r.playcount),
      rank: num(r["@attr"]?.rank),
      duration: num(r.duration),
      image: bestImage(r.image),
    };
  });
}

function normalizeRecent(t: Record<string, unknown>): RecentTrack {
  const r = t as {
    name: string;
    url: string;
    artist: { "#text"?: string; name?: string };
    album: { "#text": string };
    image?: RawImage[];
    loved?: string;
    date?: { uts: string };
    "@attr"?: { nowplaying?: string };
  };
  return {
    name: r.name,
    artist: r.artist?.["#text"] ?? r.artist?.name ?? "",
    album: r.album?.["#text"] ?? "",
    url: r.url,
    image: bestImage(r.image),
    nowPlaying: r["@attr"]?.nowplaying === "true",
    loved: r.loved === "1",
    date: num(r.date?.uts),
  };
}

export async function getRecentTracks(
  creds: Credentials,
  user: string,
  opts: { limit?: number; page?: number; from?: number; to?: number; revalidate?: number } = {},
): Promise<RecentTracksPage> {
  const params: Record<string, string> = {
    method: "user.getRecentTracks",
    api_key: creds.apiKey,
    user,
    extended: "1",
    limit: String(opts.limit ?? 50),
    page: String(opts.page ?? 1),
  };
  if (opts.from) params.from = String(opts.from);
  if (opts.to) params.to = String(opts.to);
  const data = await call<{ recenttracks: { track: Array<Record<string, unknown>>; "@attr": Record<string, string> } }>(
    params,
    { revalidate: opts.revalidate ?? 120 },
  );
  const attr = data.recenttracks?.["@attr"] ?? {};
  const raw = data.recenttracks?.track ?? [];
  const list = Array.isArray(raw) ? raw : [raw];
  return {
    tracks: list.map(normalizeRecent),
    page: num(attr.page),
    totalPages: num(attr.totalPages),
    total: num(attr.total),
  };
}

export async function getLovedTracks(
  creds: Credentials,
  user: string,
  limit = 12,
): Promise<LovedTrack[]> {
  const data = await call<{ lovedtracks: { track: Array<Record<string, unknown>> } }>(
    { method: "user.getLovedTracks", api_key: creds.apiKey, user, limit: String(limit) },
    { revalidate: 900 },
  );
  const raw = data.lovedtracks?.track ?? [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((t) => {
    const r = t as {
      name: string;
      url: string;
      artist: { name: string };
      image?: RawImage[];
      date?: { uts: string };
    };
    return {
      name: r.name,
      artist: r.artist?.name ?? "",
      url: r.url,
      date: num(r.date?.uts),
      image: bestImage(r.image),
    };
  });
}
