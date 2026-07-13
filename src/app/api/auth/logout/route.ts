import { NextRequest, NextResponse } from "next/server";
import { clearPendingAuth, clearSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  await clearSession();
  await clearPendingAuth();
  return NextResponse.redirect(new URL("/", req.nextUrl.origin), 303);
}
