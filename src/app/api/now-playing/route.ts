import { NextResponse } from "next/server";
import { envCredentials, getRecentTracks } from "@/lib/lastfm/client";
import { getSession } from "@/lib/session";

/** Polled by the client for the live now-playing indicator. */
export async function GET() {
  const session = await getSession();
  const creds = envCredentials();
  if (!session || !creds) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const page = await getRecentTracks(creds, session.username, {
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
