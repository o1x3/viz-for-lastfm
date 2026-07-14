import Link from "next/link";
import { envCredentials } from "@/lib/lastfm/client";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-credentials": "This deployment is missing its Last.fm API keys.",
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
  const configured = !!envCredentials()?.apiSecret;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          viz<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground">Your Last.fm, visualized.</p>

        {error && (
          <p
            role="alert"
            className="w-full rounded-md border border-destructive/40 bg-destructive/10 p-3 text-left text-sm text-foreground"
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
                className="text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : configured ? (
          <form action="/api/auth/login" method="POST" className="w-full">
            <Button type="submit" size="lg" className="w-full">
              Sign in with Last.fm
            </Button>
          </form>
        ) : (
          <p className="text-xs text-muted-foreground">
            Set <code className="font-mono">LASTFM_API_KEY</code> and{" "}
            <code className="font-mono">LASTFM_SHARED_SECRET</code> to enable
            sign-in
          </p>
        )}
      </div>

      <footer className="absolute bottom-6 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          Nothing stored server-side · Not affiliated with Last.fm
        </p>
      </footer>
    </main>
  );
}
