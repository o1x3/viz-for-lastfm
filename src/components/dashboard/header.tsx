import Image from "next/image";
import Link from "next/link";
import type { UserInfo } from "@/lib/lastfm/types";
import { formatMonthYear, formatNumber } from "@/lib/format";
import { VizMark } from "@/components/viz-mark";

function Monogram({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={name}
      className="flex size-14 items-center justify-center rounded-full bg-secondary"
    >
      <span className="text-lg font-medium text-muted-foreground">
        {(name.trim().charAt(0) || "?").toUpperCase()}
      </span>
    </div>
  );
}

/** Console masthead: slim nav bar, then listener identity + total scrobbles. */
export function DashHeader({
  info,
  isOwner,
  isDemo,
}: {
  info: UserInfo;
  isOwner: boolean;
  isDemo: boolean;
}) {
  const meta = [
    info.realname || null,
    info.country && info.country !== "None" ? info.country : null,
    `since ${formatMonthYear(info.registered)}`,
  ].filter(Boolean);

  return (
    <header>
      {/* nav bar */}
      <div className="flex items-center justify-between border-b border-border py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground transition-colors duration-150 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <VizMark size={20} />
          viz
        </Link>
        <div className="flex items-center gap-3">
          {isDemo && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              demo data
            </span>
          )}
          {isOwner && (
            <>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                you
              </span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Sign out
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* masthead */}
      <div className="flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="flex min-w-0 items-center gap-4">
          {info.avatar ? (
            <Image
              src={info.avatar}
              alt={`${info.name}'s avatar`}
              width={56}
              height={56}
              sizes="56px"
              className="size-14 rounded-full object-cover"
            />
          ) : (
            <Monogram name={info.name} />
          )}
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight md:text-3xl">
              {info.name}
            </h1>
            <p className="mt-1 truncate text-[13px] text-muted-foreground">
              {meta.join(" · ")}
            </p>
          </div>
        </div>

        <div className="shrink-0 md:text-right">
          <p
            className="tnum text-4xl font-semibold leading-none tracking-tight"
            aria-label={`${formatNumber(info.playcount)} total scrobbles`}
          >
            {formatNumber(info.playcount)}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">scrobbles</p>
        </div>
      </div>
    </header>
  );
}
