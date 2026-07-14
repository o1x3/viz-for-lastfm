import { NextRequest, NextResponse } from "next/server";
import { authUrl, envCredentials } from "@/lib/lastfm/client";

export async function POST(req: NextRequest) {
  const creds = envCredentials();
  const origin = req.nextUrl.origin;
  if (!creds?.apiKey || !creds.apiSecret) {
    return NextResponse.redirect(new URL("/?error=missing-credentials", origin), 303);
  }
  const callback = `${origin}/api/auth/callback`;
  return NextResponse.redirect(authUrl(creds.apiKey, callback), 303);
}
