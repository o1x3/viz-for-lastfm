import { Skeleton } from "@/components/ui/skeleton";

/**
 * Suspense fallbacks for the streamed dashboard sections. Each mirrors the
 * final panel layout of its section: same card chrome, padding, and grid;
 * so content arrival causes no layout shift.
 */

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-border bg-card p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

/** Ghost stat strip (mirrors OverviewBand's four cells). */
export function OverviewSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card p-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-2 h-6 w-12" />
        </div>
      ))}
    </div>
  );
}

/** Daily + weekday row, then the two circular charts (mirrors the Rhythms grid). */
export function RhythmsSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-3" aria-hidden="true">
      <div className="grid gap-3 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <Skeleton className="h-56 w-full rounded-sm" />
          <Skeleton className="mt-3 h-3 w-48" />
        </Panel>
        <Panel>
          <Skeleton className="h-56 w-full rounded-sm" />
          <Skeleton className="mt-3 h-3 w-32" />
        </Panel>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Panel key={i}>
            <Skeleton className="mx-auto size-56 rounded-full" />
            <Skeleton className="mt-3 h-3 w-40" />
          </Panel>
        ))}
      </div>
    </div>
  );
}

function GhostRow({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex items-baseline gap-3 py-2.5">
      <Skeleton className={`h-4 ${wide ? "w-3/5" : "w-2/5"}`} />
      <Skeleton className="ml-auto h-3 w-12 shrink-0" />
    </div>
  );
}

/** Artist panel + album/track panels (mirrors the Top section). */
export function RotationSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mt-4 rounded-lg border border-border bg-card p-5">
        <Skeleton className="h-4 w-24" />
        <div className="mt-3 divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <GhostRow key={i} wide={i < 2} />
          ))}
        </div>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col} className="rounded-lg border border-border bg-card p-5">
            <Skeleton className="h-4 w-24" />
            <div className="mt-3 divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <GhostRow key={i} wide={i % 2 === 0} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** One track list panel (mirrors RecentTracks / LovedTracks). */
export function TrackColumnSkeleton() {
  return (
    <div
      className="rounded-lg border border-border bg-card p-4 sm:p-5"
      aria-hidden="true"
    >
      <Skeleton className="h-4 w-28" />
      <div className="mt-2 divide-y divide-border">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-baseline gap-3 py-2.5">
            <Skeleton className={`h-4 ${i % 3 === 0 ? "w-3/4" : "w-1/2"}`} />
            <Skeleton className="ml-auto h-3 w-14 shrink-0" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-3 h-3 w-36" />
    </div>
  );
}
