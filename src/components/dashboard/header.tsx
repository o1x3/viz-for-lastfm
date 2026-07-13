import Image from "next/image";
import Link from "next/link";
import type { UserInfo } from "@/lib/lastfm/types";
import { daysSince, formatMonthYear, formatNumber } from "@/lib/format";

function Monogram({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={name}
      className="flex size-16 items-center justify-center rounded-full bg-muted md:size-20"
    >
      <span className="font-display text-2xl italic text-foreground/60 md:text-3xl">
        {(name.trim().charAt(0) || "?").toUpperCase()}
      </span>
    </div>
  );
}

/** Magazine-folio masthead: wordmark row, then listener identity + the big number. */
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
    `scrobbling since ${formatMonthYear(info.registered)} (${formatNumber(daysSince(info.registered))} days)`,
  ].filter(Boolean);

  return (
    <header>
      {/* folio row */}
      <div className="flex items-baseline justify-between border-b border-border py-4">
        <Link
          href="/"
          className="font-display text-xl italic tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Sleeve
        </Link>
        <div className="flex items-center gap-4">
          {isDemo && (
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              demo pressing
            </span>
          )}
          {isOwner && (
            <>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                you
              </span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  sign out
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* masthead */}
      <div className="flex flex-col gap-10 py-10 md:flex-row md:items-end md:justify-between md:gap-8 md:py-14">
        <div className="min-w-0">
          <div className="flex items-center gap-5">
            {info.avatar ? (
              <Image
                src={info.avatar}
                alt={`${info.name}'s avatar`}
                width={80}
                height={80}
                sizes="80px"
                className="size-16 rounded-full object-cover md:size-20"
              />
            ) : (
              <Monogram name={info.name} />
            )}
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                the listening notes of
              </p>
              <h1 className="truncate font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
                {info.name}
              </h1>
            </div>
          </div>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {meta.join(" · ")}
          </p>
        </div>

        <div className="shrink-0 md:text-right">
          <p
            className="font-display tnum leading-none text-[clamp(3.75rem,10vw,7rem)] tracking-tight"
            aria-label={`${formatNumber(info.playcount)} total scrobbles`}
          >
            {formatNumber(info.playcount)}
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            scrobbles
          </p>
        </div>
      </div>
    </header>
  );
}
