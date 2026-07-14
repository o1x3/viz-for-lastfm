import Link from "next/link";

/** Quiet fine print at the bottom of the dashboard. */
export function DashFooter({ isDemo }: { isDemo: boolean }) {
  return (
    <footer className="mt-12 pb-8">
      {isDemo && (
        <p className="mb-2 text-xs text-muted-foreground">
          This is sample data —{" "}
          <Link
            href="/"
            className="underline underline-offset-4 transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            sign in to see yours
          </Link>
        </p>
      )}
      <div className="flex flex-col gap-1 text-xs text-muted-foreground md:flex-row md:items-baseline md:justify-between">
        <p>
          Data from{" "}
          <a
            href="https://www.last.fm"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Last.fm
          </a>
        </p>
        <p>A nonprofit fan project · nothing stored server-side</p>
      </div>
    </footer>
  );
}
