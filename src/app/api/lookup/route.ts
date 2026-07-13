import { NextRequest, NextResponse } from "next/server";
import { envCredentials, getUserInfo, LastfmError } from "@/lib/lastfm/client";
import { setSession } from "@/lib/session";

/**
 * Username-only mode: verify the user exists, then store a sealed session
 * with just the username + API key (no Last.fm session key).
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const username = String(form.get("username") ?? "").trim();
  const apiKey = String(form.get("apiKey") ?? "").trim() || envCredentials()?.apiKey || "";
  const origin = req.nextUrl.origin;

  if (!username) return NextResponse.redirect(new URL("/?error=missing-username", origin), 303);
  if (!apiKey) return NextResponse.redirect(new URL("/?error=missing-credentials", origin), 303);

  try {
    const info = await getUserInfo({ apiKey }, username);
    await setSession({ username: info.name, apiKey });
    return NextResponse.redirect(new URL(`/u/${encodeURIComponent(info.name)}`, origin), 303);
  } catch (e) {
    if (e instanceof LastfmError && e.code === 6) {
      return NextResponse.redirect(new URL("/?error=user-not-found", origin), 303);
    }
    if (e instanceof LastfmError && e.code === 10) {
      return NextResponse.redirect(new URL("/?error=bad-api-key", origin), 303);
    }
    return NextResponse.redirect(new URL("/?error=lookup-failed", origin), 303);
  }
}
