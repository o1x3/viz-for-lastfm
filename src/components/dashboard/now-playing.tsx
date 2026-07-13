"use client";

import { useEffect, useState } from "react";
import type { RecentTrack } from "@/lib/lastfm/types";
import { ArtTile } from "@/components/art-tile";

const POLL_MS = 45_000;

/**
 * Slim live bar shown only while something is spinning.
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
        /* transient network error — keep last known state */
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
      className="flex items-center gap-4 border-b border-border py-4"
      role="status"
      aria-live="polite"
      aria-label={`Now playing: ${track.name} by ${track.artist}`}
    >
      <style>{`
        @keyframes sleeve-eq {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .sleeve-eq-bar {
          transform-origin: bottom;
          animation: sleeve-eq 0.9s ease-in-out infinite;
        }
        @keyframes sleeve-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .sleeve-live-dot {
          animation: sleeve-pulse 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .sleeve-eq-bar, .sleeve-live-dot { animation: none; }
          .sleeve-eq-bar { transform: scaleY(0.6); }
        }
      `}</style>

      <span className="size-2 shrink-0 rounded-full bg-primary sleeve-live-dot" aria-hidden="true" />

      <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
        <span className="sleeve-eq-bar w-[3px] bg-primary" style={{ height: "100%" }} />
        <span
          className="sleeve-eq-bar w-[3px] bg-primary"
          style={{ height: "100%", animationDelay: "0.25s" }}
        />
        <span
          className="sleeve-eq-bar w-[3px] bg-primary"
          style={{ height: "100%", animationDelay: "0.5s" }}
        />
      </span>

      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
        now spinning
      </span>

      <ArtTile
        src={track.image}
        alt={`${track.album || track.name} artwork`}
        label={track.album || track.name}
        className="size-10 shrink-0"
      />

      <p className="min-w-0 truncate text-sm">
        <span className="font-medium text-foreground">{track.name}</span>
        <span className="text-muted-foreground"> — {track.artist}</span>
      </p>
    </div>
  );
}
