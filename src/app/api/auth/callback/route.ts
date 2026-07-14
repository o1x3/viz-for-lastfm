import { NextRequest, NextResponse } from "next/server";
import { envCredentials, getSession as lastfmGetSession, LastfmError } from "@/lib/lastfm/client";
import { setSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const origin = req.nextUrl.origin;
  if (!token) {
    return NextResponse.redirect(new URL("/?error=auth-denied", origin));
  }

  const creds = envCredentials();
  if (!creds?.apiKey || !creds.apiSecret) {
    return NextResponse.redirect(new URL("/?error=missing-credentials", origin));
  }

  try {
    const session = await lastfmGetSession(
      { apiKey: creds.apiKey, apiSecret: creds.apiSecret },
      token,
    );
    await setSession({ username: session.name, sessionKey: session.key });
    return NextResponse.redirect(new URL(`/u/${encodeURIComponent(session.name)}`, origin));
  } catch (e) {
    const msg = e instanceof LastfmError ? `lastfm-${e.code}` : "auth-failed";
    return NextResponse.redirect(new URL(`/?error=${msg}`, origin));
  }
}
