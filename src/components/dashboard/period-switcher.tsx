"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { PERIODS, type Period } from "@/lib/lastfm/types";
import { cn } from "@/lib/utils";

/** Segmented control: active segment gets a raised background. */
export function PeriodSwitcher({ current }: { current: Period }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const select = (value: Period) => {
    if (value === current) return;
    startTransition(() => {
      router.replace(`${pathname}?period=${value}`, { scroll: false });
    });
  };

  return (
    <div
      role="group"
      aria-label="Time period"
      className={cn(
        "inline-flex flex-wrap items-center gap-0.5 rounded-md bg-secondary p-0.5 transition-opacity",
        isPending && "opacity-50",
      )}
    >
      {PERIODS.map((p) => {
        const active = p.value === current;
        return (
          <button
            key={p.value}
            type="button"
            onClick={() => select(p.value)}
            aria-pressed={active}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
