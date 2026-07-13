import { NextResponse } from "next/server";
import { getRecentTracks } from "@/lib/lastfm/client";
import { getSession } from "@/lib/session";

/** Polled by the client for the live "now spinning" indicator. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const page = await getRecentTracks(session, session.username, {
      limit: 1,
      revalidate: 30,
    });
    const track = page.tracks[0];
    return NextResponse.json({
      nowPlaying: track?.nowPlaying ? track : null,
    });
  } catch {
    return NextResponse.json({ nowPlaying: null });
  }
}
