import { Skeleton } from "@/components/ui/skeleton";

function PanelSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
      <Skeleton className="h-4 w-28" />
      <div className="mt-3 divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-baseline gap-3 py-2.5">
            <Skeleton className={`h-4 ${i % 3 === 0 ? "w-3/4" : "w-1/2"}`} />
            <Skeleton className="ml-auto h-3 w-12 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 md:px-10" aria-busy="true">
      {/* nav bar */}
      <div className="flex items-center justify-between border-b border-border py-3">
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* masthead */}
      <div className="flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-3 w-56" />
          </div>
        </div>
        <div className="md:text-right">
          <Skeleton className="h-9 w-40 md:ml-auto" />
          <Skeleton className="mt-2 h-3 w-16 md:ml-auto" />
        </div>
      </div>

      {/* stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-7 w-16" />
          </div>
        ))}
      </div>

      {/* section panels */}
      <div className="mt-10">
        <Skeleton className="h-4 w-20" />
        <div className="mt-4 rounded-lg border border-border bg-card p-4 sm:p-5">
          <Skeleton className="h-64 w-full rounded-sm" />
        </div>
      </div>
      <div className="mt-10">
        <Skeleton className="h-4 w-20" />
        <div className="mt-4">
          <PanelSkeleton />
        </div>
      </div>
      <div className="mt-10 grid gap-3 lg:grid-cols-2">
        <PanelSkeleton rows={8} />
        <PanelSkeleton rows={8} />
      </div>

      <div className="mt-12 pb-8">
        <Skeleton className="h-3 w-64" />
      </div>
    </main>
  );
}
