import { NextRequest, NextResponse } from "next/server";
import { authUrl, envCredentials } from "@/lib/lastfm/client";
import { setPendingAuth } from "@/lib/session";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const apiKey = String(form.get("apiKey") ?? "").trim() || envCredentials()?.apiKey || "";
  const apiSecret =
    String(form.get("apiSecret") ?? "").trim() || envCredentials()?.apiSecret || "";

  const origin = req.nextUrl.origin;
  if (!apiKey || !apiSecret) {
    return NextResponse.redirect(new URL("/?error=missing-credentials", origin), 303);
  }

  await setPendingAuth({ apiKey, apiSecret });
  const callback = `${origin}/api/auth/callback`;
  return NextResponse.redirect(authUrl(apiKey, callback), 303);
}
