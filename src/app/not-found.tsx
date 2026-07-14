import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-muted-foreground tnum">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        The page you were looking for doesn&rsquo;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm text-foreground underline underline-offset-4 transition-colors duration-150 hover:text-primary"
      >
        Back home
      </Link>
    </main>
  );
}
