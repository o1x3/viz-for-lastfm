import Link from "next/link";

/** Colophon — the fine print at the bottom of the sleeve. */
export function DashFooter({ isDemo }: { isDemo: boolean }) {
  return (
    <footer className="mt-16 border-t border-border py-8">
      {isDemo && (
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          this is sample data —{" "}
          <Link
            href="/"
            className="underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            connect your own account
          </Link>
        </p>
      )}
      <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:items-baseline md:justify-between">
        <p>
          data from{" "}
          <a
            href="https://www.last.fm"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Last.fm
          </a>
        </p>
        <p>a nonprofit fan project · bring your own api key · nothing stored server-side</p>
      </div>
    </footer>
  );
}
