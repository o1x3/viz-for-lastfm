import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Side B · Track 404
      </p>
      <h1 className="font-display mt-6 text-6xl leading-[1.05] tracking-tight text-foreground sm:text-8xl">
        B-side not found.
      </h1>
      <p className="mt-6 max-w-md text-balance text-muted-foreground">
        This groove was never pressed. The page you&apos;re looking for isn&apos;t
        in the crate.
      </p>
      <div className="mt-10 h-px w-16 bg-border" aria-hidden="true" />
      <Link
        href="/"
        className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-primary underline-offset-4 hover:underline"
      >
        Back to the sleeve
      </Link>
    </main>
  );
}
