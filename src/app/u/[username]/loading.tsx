import { Skeleton } from "@/components/ui/skeleton";

function SectionSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="mt-16 border-t border-border pt-4">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-9 w-56" />
      <Skeleton className={`mt-8 w-full rounded-sm ${tall ? "h-72" : "h-44"}`} />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 md:px-10" aria-busy="true">
      {/* folio row */}
      <div className="flex items-baseline justify-between border-b border-border py-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>

      {/* masthead */}
      <div className="flex flex-col gap-10 py-10 md:flex-row md:items-end md:justify-between md:py-14">
        <div className="flex items-center gap-5">
          <Skeleton className="size-16 rounded-full md:size-20" />
          <div>
            <Skeleton className="h-3 w-40" />
            <Skeleton className="mt-3 h-14 w-64 md:h-16" />
          </div>
        </div>
        <div className="md:text-right">
          {/* the big numeral */}
          <Skeleton className="h-16 w-64 md:ml-auto md:h-24 md:w-80" />
          <Skeleton className="mt-3 h-3 w-24 md:ml-auto" />
        </div>
      </div>

      {/* stat band */}
      <div className="mt-10 border-y border-border">
        <div className="grid grid-cols-2 md:grid-cols-5 md:divide-x md:divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-6 first:pl-0 md:py-8">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="mt-4 h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      <SectionSkeleton tall />
      <SectionSkeleton tall />
      <div className="grid gap-12 lg:grid-cols-2">
        <SectionSkeleton />
        <SectionSkeleton />
      </div>

      <div className="mt-16 border-t border-border py-8">
        <Skeleton className="h-3 w-72" />
      </div>
    </main>
  );
}
