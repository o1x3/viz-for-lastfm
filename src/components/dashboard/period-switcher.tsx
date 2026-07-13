"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { PERIODS, type Period } from "@/lib/lastfm/types";
import { cn } from "@/lib/utils";

/** Inline segmented text control — mono microcaps, active gets a crimson underline. */
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
        "flex flex-wrap items-baseline gap-x-5 gap-y-2 transition-opacity",
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
              "border-b pb-1 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
