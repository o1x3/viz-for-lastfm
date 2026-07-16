"use client";

import { useEffect, useState } from "react";
import type { RecentTrack } from "@/lib/lastfm/types";
import { ArtTile } from "@/components/art-tile";

const POLL_MS = 45_000;

/**
 * Slim live panel shown only while something is playing.
 * When the viewer owns the profile we poll /api/now-playing every 45s,
 * pausing while the tab is hidden.
 */
export function NowPlaying({
  initial,
  isOwner,
}: {
  initial: RecentTrack | null;
  isOwner: boolean;
}) {
  const [track, setTrack] = useState<RecentTrack | null>(
    initial?.nowPlaying ? initial : null,
  );

  useEffect(() => {
    if (!isOwner) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch("/api/now-playing");
        if (!res.ok) return;
        const json: { nowPlaying: RecentTrack | null } = await res.json();
        if (!cancelled) setTrack(json.nowPlaying ?? null);
      } catch {
        /* transient network error: keep last known state */
      }
    };

    const start = () => {
      if (timer === null) timer = setInterval(poll, POLL_MS);
    };
    const stop = () => {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else {
        void poll();
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isOwner]);

  if (!track) return null;

  return (
    <div
      className="mb-8 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5"
      role="status"
      aria-live="polite"
      aria-label={`Now playing: ${track.name} by ${track.artist}`}
    >
      <style>{`
        @keyframes viz-eq {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .viz-eq-bar {
          transform-origin: bottom;
          animation: viz-eq 0.9s ease-in-out infinite;
        }
        @keyframes viz-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .viz-live-dot {
          animation: viz-pulse 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .viz-eq-bar, .viz-live-dot { animation: none; }
          .viz-eq-bar { transform: scaleY(0.6); }
        }
      `}</style>

      <span className="viz-live-dot size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />

      <span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true">
        <span className="viz-eq-bar w-[2px] bg-muted-foreground/60" style={{ height: "100%" }} />
        <span
          className="viz-eq-bar w-[2px] bg-muted-foreground/60"
          style={{ height: "100%", animationDelay: "0.25s" }}
        />
        <span
          className="viz-eq-bar w-[2px] bg-muted-foreground/60"
          style={{ height: "100%", animationDelay: "0.5s" }}
        />
      </span>

      <span className="shrink-0 text-xs text-muted-foreground">Now playing</span>

      <ArtTile
        src={track.image}
        alt={`${track.album || track.name} artwork`}
        label={track.album || track.name}
        className="size-8 shrink-0"
      />

      {/* mobile: wrap to 2 lines at word boundaries; sm+: single line with ellipsis */}
      <p
        className="min-w-0 text-sm line-clamp-2 sm:line-clamp-1"
        title={`${track.name} - ${track.artist}`}
      >
        <span className="font-medium text-foreground">{track.name}</span>
        <span className="text-muted-foreground"> - {track.artist}</span>
      </p>
    </div>
  );
}
