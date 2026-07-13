import Link from "next/link";
import { envCredentials } from "@/lib/lastfm/client";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/landing/reveal";
import { Vinyl } from "@/components/landing/vinyl";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-credentials":
    "No API credentials were provided. Add your Last.fm API key below to continue.",
  "missing-username": "Enter a Last.fm username to look up.",
  "user-not-found":
    "That Last.fm user doesn't seem to exist. Check the spelling and try again.",
  "bad-api-key": "Last.fm rejected that API key. Double-check it and try again.",
  "auth-denied":
    "Authorization was declined on Last.fm. Nothing was stored — try again whenever you like.",
  "session-expired": "Your session expired. Sign in again below.",
  "lookup-failed": "That lookup didn't go through. Give it another try in a moment.",
  "auth-failed": "Signing in with Last.fm failed. Try again below.",
};

function errorMessage(code?: string): string | null {
  if (!code) return null;
  if (ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];
  const lastfm = code.match(/^lastfm-(\d+)$/);
  if (lastfm) {
    return `Last.fm returned an error (code ${lastfm[1]}). Try again in a moment.`;
  }
  return "Something unexpected went wrong. Try again.";
}

function Micro({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground ${className}`}
    >
      {children}
    </p>
  );
}

const microLabel =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const microLink = `${microLabel} rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4`;

const TRUST_ITEMS = [
  {
    n: "01",
    title: "Sealed in your browser",
    body: "Your API key and session live in an encrypted cookie on your device — nowhere else.",
  },
  {
    n: "02",
    title: "Nothing stored here",
    body: "This server keeps no accounts, no database, no record of you. Close the tab and it forgets.",
  },
  {
    n: "03",
    title: "Open source",
    body: "Every line is public. Read it, fork it, run your own pressing.",
  },
  {
    n: "04",
    title: "Nonprofit",
    body: "Built for the love of it. Not affiliated with Last.fm Ltd.",
  },
];

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
    <div className="flex flex-1 flex-col overflow-x-clip">
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 sm:px-10">
        {/* ── Masthead ─────────────────────────────────────────────── */}
        <header className="flex items-baseline justify-between gap-6 pt-8 pb-6">
          <div className="flex items-baseline gap-5">
            <span className="font-display text-2xl font-semibold tracking-tight">
              Sleeve
            </span>
            <Micro className="hidden sm:block">
              A record of your records
            </Micro>
          </div>
          <Link href="/u/demo" className={microLink}>
            see it first&nbsp;&rarr;
          </Link>
        </header>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section
          aria-labelledby="hero-heading"
          className="grid grid-cols-1 items-center gap-x-10 gap-y-16 border-t border-border pt-14 pb-24 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <Reveal>
              <Micro>N&ordm; 001 &mdash; The front matter</Micro>
              <h1
                id="hero-heading"
                className="mt-6 font-display text-[clamp(3.25rem,9vw,7.5rem)] leading-[0.95] font-medium tracking-tight text-balance"
              >
                Your listening,
                <br />
                pressed &amp;{" "}
                <em className="font-light italic">sleeved</em>
                <span className="text-primary">.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-md leading-relaxed text-muted-foreground">
                Sleeve reads your Last.fm scrobbles and sets them like liner
                notes &mdash; the heavy rotation, the deep cuts, the one artist
                you couldn&rsquo;t put down. Bring your own API key. This
                server stores nothing.
              </p>
            </Reveal>

            {error && (
              <Reveal delay={0.2}>
                <div
                  role="alert"
                  className="mt-8 max-w-md border-l-2 border-primary bg-primary/10 px-4 py-3"
                >
                  <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                    Needle skip
                  </p>
                  <p className="mt-1 text-sm text-foreground/90">{error}</p>
                </div>
              </Reveal>
            )}

            {session && (
              <Reveal delay={0.25}>
                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <Button asChild size="lg" className="font-medium">
                    <Link href={`/u/${session.username}`}>
                      Continue as {session.username}&nbsp;&rarr;
                    </Link>
                  </Button>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className={`${microLabel} cursor-pointer rounded-sm underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4`}
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              </Reveal>
            )}
          </div>

          {/* record sliding out of its sleeve, bleeding off-grid to the right */}
          <div className="relative lg:col-span-5">
            <Reveal delay={0.3}>
              <div className="relative mx-auto max-w-md lg:mx-0 lg:max-w-none lg:translate-x-14">
                {/* the sleeve */}
                <div className="absolute top-1/2 left-0 z-0 hidden aspect-square w-[82%] -translate-y-1/2 border border-border bg-card/70 sm:block">
                  <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    SLV&ndash;001
                  </span>
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    Long play
                  </span>
                  <span
                    className="absolute right-4 bottom-4 h-8 w-16 opacity-40"
                    aria-hidden="true"
                    style={{
                      background:
                        "repeating-linear-gradient(90deg, var(--cream) 0 1px, transparent 1px 3px, var(--cream) 3px 5px, transparent 5px 6px)",
                    }}
                  />
                </div>
                {/* the record */}
                <Vinyl className="relative z-10 w-[88%] sm:ml-auto sm:w-[78%]" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Two ways in ──────────────────────────────────────────── */}
        <section aria-labelledby="entry-heading" className="border-t border-border">
          <Reveal delay={0.4}>
            <div className="grid gap-x-10 gap-y-10 pt-10 pb-16 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <Micro>Drop the needle</Micro>
                <h2 id="entry-heading" className="mt-3 font-display text-3xl">
                  Two ways in
                </h2>
                {hasEnvKey ? (
                  <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    Whoever runs this pressing already supplied API
                    credentials &mdash; no key needed on your end.
                  </p>
                ) : (
                  <details className="group mt-5 max-w-xs">
                    <summary
                      className={`${microLabel} cursor-pointer list-none rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4`}
                    >
                      Need an API key?{" "}
                      <span className="text-primary group-open:hidden">+</span>
                      <span className="hidden text-primary group-open:inline">
                        &minus;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Grab a free one at{" "}
                      <a
                        href="https://www.last.fm/api/account/create"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm text-foreground underline decoration-primary/60 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        last.fm/api/account/create
                      </a>
                      . Takes about 30 seconds &mdash; any application name
                      works, leave the callback URL blank.
                    </p>
                  </details>
                )}
              </div>

              <div className="grid gap-y-10 lg:col-span-9 sm:grid-cols-2 sm:gap-y-0">
                {/* Side A — log in */}
                <div className="sm:border-r sm:border-border sm:pr-10">
                  <div className="flex items-baseline gap-4">
                    <span
                      className="font-display text-5xl font-medium text-primary"
                      aria-hidden="true"
                    >
                      A
                    </span>
                    <div>
                      <Micro>Side A &mdash; 33&#8531; rpm</Micro>
                      <h3 className="mt-1 font-display text-xl">
                        Log in with Last.fm
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Your own dashboard, authorized in one click on Last.fm.
                  </p>
                  <form action="/api/auth/login" method="POST" className="mt-6 space-y-4">
                    {!hasEnvKey && (
                      <>
                        <div className="space-y-1.5">
                          <label htmlFor="login-api-key" className={microLabel}>
                            API key
                          </label>
                          <Input
                            id="login-api-key"
                            name="apiKey"
                            required
                            autoComplete="off"
                            spellCheck={false}
                            placeholder="32-character key"
                            className="font-mono text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="login-api-secret" className={microLabel}>
                            Shared secret
                          </label>
                          <Input
                            id="login-api-secret"
                            name="apiSecret"
                            type="password"
                            required
                            autoComplete="off"
                            spellCheck={false}
                            placeholder="shown next to your key"
                            className="font-mono text-sm"
                          />
                        </div>
                      </>
                    )}
                    <Button type="submit" className="font-medium">
                      Log in with Last.fm&nbsp;&rarr;
                    </Button>
                  </form>
                </div>

                {/* Side B — lookup */}
                <div className="sm:pl-10">
                  <div className="flex items-baseline gap-4">
                    <span
                      className="font-display text-5xl font-medium text-muted-foreground"
                      aria-hidden="true"
                    >
                      B
                    </span>
                    <div>
                      <Micro>Side B &mdash; guest listening</Micro>
                      <h3 className="mt-1 font-display text-xl">
                        Just look someone up
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Any public Last.fm profile, no sign-in required.
                  </p>
                  <form action="/api/lookup" method="POST" className="mt-6 space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="lookup-username" className={microLabel}>
                        Username
                      </label>
                      <Input
                        id="lookup-username"
                        name="username"
                        required
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="e.g. rj"
                        className="text-sm"
                      />
                    </div>
                    {!hasEnvKey && (
                      <div className="space-y-1.5">
                        <label htmlFor="lookup-api-key" className={microLabel}>
                          API key
                        </label>
                        <Input
                          id="lookup-api-key"
                          name="apiKey"
                          required
                          autoComplete="off"
                          spellCheck={false}
                          placeholder="32-character key"
                          className="font-mono text-sm"
                        />
                      </div>
                    )}
                    <Button type="submit" variant="outline" className="font-medium">
                      Look them up&nbsp;&rarr;
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Trust strip ──────────────────────────────────────────── */}
        <section aria-label="Privacy and trust" className="border-t border-border">
          <Reveal delay={0.5}>
            <div className="grid gap-x-10 gap-y-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_ITEMS.map((item) => (
                <div key={item.n}>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-primary tnum">
                    {item.n}
                  </p>
                  <h3 className="mt-2 font-display text-lg">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-border py-8">
          <p className="font-display text-lg italic">
            Sleeve &mdash; liner notes for your listening.
          </p>
          <Micro>Built for the love of scrobbling</Micro>
        </div>
      </footer>
    </div>
  );
}
