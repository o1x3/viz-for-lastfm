import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Sealed, httpOnly cookie session. Nothing is stored server-side:
 * the user's API key (+ optional secret and Last.fm session key) live
 * AES-256-GCM-encrypted in the cookie itself.
 */

const COOKIE_NAME = "vinyl_session";
const PENDING_COOKIE = "vinyl_auth_pending";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year; last.fm session keys don't expire

export interface Session {
  username: string;
  apiKey: string;
  apiSecret?: string;
  /** present only after "Log in with Last.fm" */
  sessionKey?: string;
}

export interface PendingAuth {
  apiKey: string;
  apiSecret: string;
}

function key(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET env var is required in production");
    }
    // Dev fallback: deterministic key so hot reloads keep sessions.
    return createHash("sha256").update("vinyl-dev-secret").digest();
  }
  return createHash("sha256").update(secret).digest();
}

export function seal(data: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const plaintext = Buffer.from(JSON.stringify(data), "utf8");
  const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

export function unseal<T>(sealed: string): T | null {
  try {
    const buf = Buffer.from(sealed, "base64url");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const enc = buf.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
    return JSON.parse(dec.toString("utf8")) as T;
  } catch {
    return null;
  }
}

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const s = unseal<Session>(raw);
  return s?.username && s?.apiKey ? s : null;
}

export async function setSession(session: Session): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, seal(session), { ...cookieOpts, maxAge: MAX_AGE });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** Short-lived cookie carrying BYO credentials across the Last.fm redirect. */
export async function setPendingAuth(pending: PendingAuth): Promise<void> {
  const jar = await cookies();
  jar.set(PENDING_COOKIE, seal(pending), { ...cookieOpts, maxAge: 600 });
}

export async function getPendingAuth(): Promise<PendingAuth | null> {
  const jar = await cookies();
  const raw = jar.get(PENDING_COOKIE)?.value;
  return raw ? unseal<PendingAuth>(raw) : null;
}

export async function clearPendingAuth(): Promise<void> {
  const jar = await cookies();
  jar.delete(PENDING_COOKIE);
}
