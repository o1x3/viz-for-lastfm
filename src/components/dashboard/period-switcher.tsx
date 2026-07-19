"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { PERIODS, type Period } from "@/lib/lastfm/types";
import { cn } from "@/lib/utils";
import { DitherButton } from "@/components/dither-kit";

/** Segmented control — dithered buttons, active segment in red. */
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
        "inline-flex flex-wrap items-center gap-1.5 transition-opacity",
        isPending && "opacity-50",
      )}
    >
      {PERIODS.map((p) => {
        const active = p.value === current;
        return (
          <DitherButton
            key={p.value}
            type="button"
            onClick={() => select(p.value)}
            aria-pressed={active}
            color={active ? "red" : "grey"}
            variant={active ? "gradient" : "dotted"}
            className="px-2.5 py-1 text-[11px] font-bold"
          >
            {p.label}
          </DitherButton>
        );
      })}
    </div>
  );
}
