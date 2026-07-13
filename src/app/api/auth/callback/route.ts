import { NextRequest, NextResponse } from "next/server";
import { envCredentials, getSession as lastfmGetSession, LastfmError } from "@/lib/lastfm/client";
import { clearPendingAuth, getPendingAuth, setSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const origin = req.nextUrl.origin;
  if (!token) {
    return NextResponse.redirect(new URL("/?error=auth-denied", origin));
  }

  const pending = await getPendingAuth();
  const apiKey = pending?.apiKey ?? envCredentials()?.apiKey;
  const apiSecret = pending?.apiSecret ?? envCredentials()?.apiSecret;
  if (!apiKey || !apiSecret) {
    return NextResponse.redirect(new URL("/?error=session-expired", origin));
  }

  try {
    const session = await lastfmGetSession({ apiKey, apiSecret }, token);
    await setSession({
      username: session.name,
      apiKey,
      apiSecret,
      sessionKey: session.key,
    });
    await clearPendingAuth();
    return NextResponse.redirect(new URL(`/u/${encodeURIComponent(session.name)}`, origin));
  } catch (e) {
    const msg = e instanceof LastfmError ? `lastfm-${e.code}` : "auth-failed";
    return NextResponse.redirect(new URL(`/?error=${msg}`, origin));
  }
}
