import type {
  ListeningStats,
  LovedTrack,
  Period,
  RecentTrack,
  RecentTracksPage,
  TopAlbum,
  TopArtist,
  TopTrack,
  UserInfo,
} from "./types";

/**
 * Deterministic demo dataset so the app works with zero credentials
 * (design previews, and a public /u/demo for visitors).
 */

// Seeded PRNG (mulberry32) — deterministic across renders.
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ARTISTS = [
  "Radiohead", "Khruangbin", "Little Simz", "Boards of Canada", "Mitski",
  "Parcels", "MF DOOM", "Alvvays", "Four Tet", "Big Thief",
  "Stereolab", "Yussef Dayes", "Cocteau Twins", "Sufjan Stevens", "Arooj Aftab",
  "Duster", "The Smile", "Sampha", "Beach House", "Floating Points",
];

const ALBUMS: [string, string][] = [
  ["In Rainbows", "Radiohead"], ["Mordechai", "Khruangbin"],
  ["Sometimes I Might Be Introvert", "Little Simz"], ["Music Has the Right to Children", "Boards of Canada"],
  ["Laurel Hell", "Mitski"], ["Day/Night", "Parcels"],
  ["MM..FOOD", "MF DOOM"], ["Blue Rev", "Alvvays"],
  ["Sixteen Oceans", "Four Tet"], ["Dragon New Warm Mountain I Believe in You", "Big Thief"],
  ["Dots and Loops", "Stereolab"], ["Black Classical Music", "Yussef Dayes"],
  ["Heaven or Las Vegas", "Cocteau Twins"], ["Carrie & Lowell", "Sufjan Stevens"],
  ["Vulture Prince", "Arooj Aftab"], ["Stratosphere", "Duster"],
  ["Souvlaki", "Slowdive"], ["Promises", "Floating Points"],
  ["New Long Leg", "Dry Cleaning"], ["Ants From Up There", "Black Country, New Road"],
  ["In Colour", "Jamie xx"], ["Devotion", "Beach House"],
  ["Titanic Rising", "Weyes Blood"], ["Bewitched", "Laufey"],
];

const TRACKS: [string, string, string][] = [
  ["Weird Fishes/Arpeggi", "Radiohead", "In Rainbows"],
  ["Time (You and I)", "Khruangbin", "Mordechai"],
  ["Introvert", "Little Simz", "Sometimes I Might Be Introvert"],
  ["Roygbiv", "Boards of Canada", "Music Has the Right to Children"],
  ["Working for the Knife", "Mitski", "Laurel Hell"],
  ["Somethinggreater", "Parcels", "Day/Night"],
  ["Rapp Snitch Knishes", "MF DOOM", "MM..FOOD"],
  ["Belinda Says", "Alvvays", "Blue Rev"],
  ["Baby", "Four Tet", "Sixteen Oceans"],
  ["Simulation Swarm", "Big Thief", "Dragon New Warm Mountain I Believe in You"],
  ["Rainbo Conversation", "Stereolab", "Dots and Loops"],
  ["Black Classical Music", "Yussef Dayes", "Black Classical Music"],
  ["Cherry-coloured Funk", "Cocteau Twins", "Heaven or Las Vegas"],
  ["Fourth of July", "Sufjan Stevens", "Carrie & Lowell"],
  ["Mohabbat", "Arooj Aftab", "Vulture Prince"],
  ["Inside Out", "Duster", "Stratosphere"],
  ["The Smoke", "The Smile", "A Light for Attracting Attention"],
  ["Spirit 2.0", "Sampha", "Lahai"],
  ["Space Song", "Beach House", "Depression Cherry"],
  ["Birth4000", "Floating Points", "Cascade"],
];

const now = () => Math.floor(Date.now() / 1000);

export const DEMO_USERNAME = "demo";

export function demoUserInfo(): UserInfo {
  return {
    name: "demo",
    realname: "Demo Listener",
    url: "https://www.last.fm/user/demo",
    country: "Iceland",
    playcount: 128_437,
    artistCount: 4_213,
    albumCount: 8_954,
    trackCount: 31_207,
    registered: now() - 11.4 * 365 * 86400,
    avatar: null,
    subscriber: false,
  };
}

function periodSeed(period: Period): number {
  return { "7day": 7, "1month": 30, "3month": 91, "6month": 182, "12month": 365, overall: 9999 }[period];
}

export function demoTopArtists(period: Period, limit = 12): TopArtist[] {
  const r = rng(periodSeed(period));
  const shuffled = [...ARTISTS].sort(() => r() - 0.5).slice(0, limit);
  let plays = Math.round(80 + r() * 40) * (period === "overall" ? 40 : period === "12month" ? 8 : 1);
  return shuffled.map((name, i) => {
    plays = Math.max(3, Math.round(plays * (0.72 + r() * 0.2)));
    return {
      name,
      url: `https://www.last.fm/music/${encodeURIComponent(name)}`,
      playcount: plays,
      rank: i + 1,
      mbid: "",
    };
  });
}

export function demoTopAlbums(period: Period, limit = 12): TopAlbum[] {
  const r = rng(periodSeed(period) + 1);
  const shuffled = [...ALBUMS].sort(() => r() - 0.5).slice(0, limit);
  let plays = Math.round(50 + r() * 30) * (period === "overall" ? 25 : period === "12month" ? 6 : 1);
  return shuffled.map(([name, artist], i) => {
    plays = Math.max(2, Math.round(plays * (0.74 + r() * 0.18)));
    return {
      name,
      artist,
      url: `https://www.last.fm/music/${encodeURIComponent(artist)}/${encodeURIComponent(name)}`,
      playcount: plays,
      rank: i + 1,
      image: null,
    };
  });
}

export function demoTopTracks(period: Period, limit = 12): TopTrack[] {
  const r = rng(periodSeed(period) + 2);
  const shuffled = [...TRACKS].sort(() => r() - 0.5).slice(0, limit);
  let plays = Math.round(30 + r() * 20) * (period === "overall" ? 15 : period === "12month" ? 4 : 1);
  return shuffled.map(([name, artist], i) => {
    plays = Math.max(2, Math.round(plays * (0.76 + r() * 0.16)));
    return {
      name,
      artist,
      url: `https://www.last.fm/music/${encodeURIComponent(artist)}/_/${encodeURIComponent(name)}`,
      playcount: plays,
      rank: i + 1,
      duration: 180 + Math.round(r() * 180),
      image: null,
    };
  });
}

export function demoRecentTracks(limit = 20): RecentTracksPage {
  const r = rng(42);
  const t0 = now();
  const tracks: RecentTrack[] = [];
  let t = t0 - 120;
  for (let i = 0; i < limit; i++) {
    const [name, artist, album] = TRACKS[Math.floor(r() * TRACKS.length)];
    tracks.push({
      name,
      artist,
      album,
      url: `https://www.last.fm/music/${encodeURIComponent(artist)}/_/${encodeURIComponent(name)}`,
      image: null,
      nowPlaying: i === 0,
      loved: r() > 0.8,
      date: i === 0 ? 0 : t,
    });
    t -= 200 + Math.round(r() * 2000);
  }
  return { tracks, page: 1, totalPages: 6421, total: 128_437 };
}

export function demoLovedTracks(limit = 12): LovedTrack[] {
  const r = rng(7);
  const t0 = now();
  return [...TRACKS]
    .sort(() => r() - 0.5)
    .slice(0, limit)
    .map(([name, artist], i) => ({
      name,
      artist,
      url: `https://www.last.fm/music/${encodeURIComponent(artist)}/_/${encodeURIComponent(name)}`,
      date: t0 - i * 5 * 86400 - Math.round(r() * 86400),
      image: null,
    }));
}

export function demoStats(): ListeningStats {
  const r = rng(1234);
  // Plausible listening clock: quiet nights, commute bumps, evening peak.
  const shape = [2, 1, 1, 0.5, 0.5, 1, 3, 6, 8, 7, 6, 5, 6, 6, 5, 6, 7, 9, 11, 12, 10, 8, 5, 3];
  const byHour = shape.map((s) => Math.round(s * (14 + r() * 6)));
  const byWeekday = [8, 11, 12, 11, 12, 13, 9].map((s) => Math.round(s * (30 + r() * 10)));
  const byDay: Record<string, number> = {};
  const t0 = now();
  for (let i = 0; i < 90; i++) {
    const d = new Date((t0 - i * 86400) * 1000).toISOString().slice(0, 10);
    byDay[d] = r() > 0.08 ? Math.round(10 + r() * 90) : 0;
  }
  return {
    byHour,
    byWeekday,
    byDay,
    total: Object.values(byDay).reduce((a, b) => a + b, 0),
    uniqueArtists: 312,
    uniqueTracks: 1_408,
    longestStreakDays: 34,
    currentStreakDays: 12,
    from: t0 - 90 * 86400,
    to: t0,
    truncated: false,
  };
}
