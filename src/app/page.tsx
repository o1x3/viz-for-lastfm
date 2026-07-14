import Link from "next/link";
import { envCredentials } from "@/lib/lastfm/client";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-credentials": "The server has no Last.fm API key configured.",
  "user-not-found": "That Last.fm user doesn't exist.",
  "bad-api-key": "Last.fm rejected the API key.",
  "auth-denied": "Authorization was declined on Last.fm. Nothing was stored.",
  "session-expired": "Your session expired. Sign in again.",
  "auth-failed": "Signing in with Last.fm failed. Try again.",
};

function errorMessage(code?: string): string | null {
  if (!code) return null;
  if (ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];
  const lastfm = code.match(/^lastfm-(\d+)$/);
  if (lastfm) return `Last.fm returned an error (code ${lastfm[1]}). Try again in a moment.`;
  return "Something unexpected went wrong. Try again.";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorParam = typeof params.error === "string" ? params.error : undefined;
  const error = errorMessage(errorParam);
  const session = await getSession();
  const hasEnvKey = !!envCredentials();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <h1 className="font-display text-6xl italic tracking-tight">
          viz<span className="text-primary">.</span>
        </h1>
        <p className="text-muted-foreground">Your Last.fm, visualized.</p>

        {error && (
          <p
            role="alert"
            className="w-full border-l-2 border-primary py-1 pl-4 text-left text-sm text-foreground"
          >
            {error}
          </p>
        )}

        {session ? (
          <div className="flex w-full flex-col items-center gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href={`/u/${encodeURIComponent(session.username)}`}>
                Continue as {session.username} →
              </Link>
            </Button>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <form action="/api/auth/login" method="POST" className="flex w-full flex-col gap-3">
            {!hasEnvKey && (
              <>
                <label className="sr-only" htmlFor="apiKey">
                  Last.fm API key
                </label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  required
                  autoComplete="off"
                  placeholder="Last.fm API key"
                  className="font-mono"
                />
                <label className="sr-only" htmlFor="apiSecret">
                  Shared secret
                </label>
                <Input
                  id="apiSecret"
                  name="apiSecret"
                  type="password"
                  required
                  autoComplete="off"
                  placeholder="Shared secret"
                  className="font-mono"
                />
              </>
            )}
            <Button type="submit" size="lg" className="w-full">
              Sign in with Last.fm
            </Button>
          </form>
        )}
      </div>

      <footer className="absolute bottom-6 px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Nothing stored server-side · Not affiliated with Last.fm
        </p>
      </footer>
    </main>
  );
}
