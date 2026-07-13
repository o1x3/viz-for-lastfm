import { Skeleton } from "@/components/ui/skeleton";

/**
 * Suspense fallbacks for the streamed dashboard sections. Each mirrors the
 * final layout of its section — hairline rules, ghost numerals, editorial
 * spacing — so content arrival causes no layout shift.
 */

/** Ghost numeral rows behind the stat band (mirrors StatTiles). */
export function StatTilesSkeleton() {
  return (
    <div className="border-y border-border" aria-hidden="true">
      <div className="grid grid-cols-2 md:grid-cols-5 md:divide-x md:divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-5 py-6 first:pl-0 md:py-8">
            <Skeleton className="h-9 w-24 md:h-11" />
            <Skeleton className="mt-3 h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Clock disc + weekday bars + day strip ghosts (mirrors the Rhythms grid). */
export function RhythmsSkeleton() {
  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-5 lg:gap-12" aria-hidden="true">
      <div className="lg:col-span-3">
        <Skeleton className="mx-auto aspect-square w-full max-w-md rounded-full" />
      </div>
      <div className="flex flex-col gap-10 lg:col-span-2">
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 flex-1 rounded-sm" style={{ maxWidth: `${90 - i * 9}%` }} />
            </div>
          ))}
        </div>
        <Skeleton className="h-16 w-full rounded-sm" />
      </div>
    </div>
  );
}

function HairlineRow({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-border/60 py-3">
      <Skeleton className="h-3 w-8 shrink-0" />
      <Skeleton className={`h-5 ${wide ? "w-3/5" : "w-2/5"}`} />
      <Skeleton className="ml-auto h-3 w-12 shrink-0" />
    </div>
  );
}

/** Typographic artist chart + album/track columns (mirrors On Rotation). */
export function RotationSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mt-8">
        <Skeleton className="h-3 w-32" />
        <div className="mt-4 flex flex-col">
          <div className="border-b border-border/60 py-4">
            <Skeleton className="h-12 w-4/5 md:h-16" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <HairlineRow key={i} wide={i < 2} />
          ))}
        </div>
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col}>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-2 h-8 w-44" />
            <div className="mt-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <HairlineRow key={i} wide={i % 2 === 0} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** One ruled track-list column (mirrors RecentTracks / LovedTracks). */
export function TrackColumnSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="border-t border-border pt-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-8 w-52" />
      </div>
      <div className="mt-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-baseline gap-4 border-b border-border/60 py-3">
            <Skeleton className="h-3 w-16 shrink-0" />
            <Skeleton className={`h-4 ${i % 3 === 0 ? "w-3/4" : "w-1/2"}`} />
          </div>
        ))}
      </div>
      <Skeleton className="mt-4 h-3 w-40" />
    </div>
  );
}
