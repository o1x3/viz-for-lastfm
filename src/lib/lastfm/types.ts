// Shapes returned by the Last.fm API (normalized for the app).
// Raw API responses use `#text` keys and string numbers; the client
// normalizes them into these types.

export type Period = "7day" | "1month" | "3month" | "6month" | "12month" | "overall";

export const PERIODS: { value: Period; label: string }[] = [
  { value: "7day", label: "Week" },
  { value: "1month", label: "Month" },
  { value: "3month", label: "3 Months" },
  { value: "6month", label: "6 Months" },
  { value: "12month", label: "Year" },
  { value: "overall", label: "All Time" },
];

export interface LastfmImage {
  size: string;
  url: string;
}

export interface UserInfo {
  name: string;
  realname: string;
  url: string;
  country: string;
  playcount: number;
  artistCount: number;
  albumCount: number;
  trackCount: number;
  /** unix seconds */
  registered: number;
  avatar: string | null;
  subscriber: boolean;
}

export interface TopArtist {
  name: string;
  url: string;
  playcount: number;
  rank: number;
  mbid: string;
}

export interface TopAlbum {
  name: string;
  artist: string;
  url: string;
  playcount: number;
  rank: number;
  image: string | null;
}

export interface TopTrack {
  name: string;
  artist: string;
  url: string;
  playcount: number;
  rank: number;
  duration: number;
  image: string | null;
}

export interface RecentTrack {
  name: string;
  artist: string;
  album: string;
  url: string;
  image: string | null;
  nowPlaying: boolean;
  loved: boolean;
  /** unix seconds; 0 when now playing */
  date: number;
}

export interface RecentTracksPage {
  tracks: RecentTrack[];
  page: number;
  totalPages: number;
  total: number;
}

export interface WeeklyChartRange {
  from: number;
  to: number;
}

export interface LovedTrack {
  name: string;
  artist: string;
  url: string;
  date: number;
  image: string | null;
}

/** Derived analytics computed from recent tracks pagination. */
export interface ListeningStats {
  /** plays per hour of day, index 0..23, local to UTC offset used */
  byHour: number[];
  /** plays per weekday, index 0 = Sunday */
  byWeekday: number[];
  /** plays per day, keyed by YYYY-MM-DD (UTC) */
  byDay: Record<string, number>;
  /** total scrobbles in the analyzed window */
  total: number;
  /** distinct artists in window */
  uniqueArtists: number;
  /** distinct tracks in window */
  uniqueTracks: number;
  /** longest run of consecutive days with >=1 scrobble */
  longestStreakDays: number;
  currentStreakDays: number;
  /** window covered, unix seconds */
  from: number;
  to: number;
  /** true if we hit the page cap and the window is truncated */
  truncated: boolean;
}
