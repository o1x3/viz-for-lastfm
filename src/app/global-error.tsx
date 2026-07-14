"use client";

// global-error can render without the root layout's CSS, so every style
// here is inline — it must never flash unstyled white.

const BG = "#0f0f0f";
const FG = "#ececec";
const RED = "#e5484d";
const MUTED = "rgba(236, 236, 236, 0.6)";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" style={{ background: BG }}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          textAlign: "center",
          background: BG,
          color: FG,
          fontFamily: SANS,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: MUTED,
            margin: 0,
          }}
        >
          Playback error
        </p>
        <h1
          style={{
            margin: "16px 0 0",
            fontSize: "clamp(28px, 5vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontWeight: 600,
          }}
        >
          Something went wrong.
        </h1>
        <p
          style={{
            margin: "16px 0 0",
            maxWidth: 420,
            color: MUTED,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          An unexpected error occurred. It is usually brief — try again.
        </p>
        {error?.digest ? (
          <p
            style={{
              margin: "12px 0 0",
              fontFamily: MONO,
              fontSize: 12,
              color: MUTED,
            }}
          >
            ref: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: 32,
            padding: "8px 20px",
            background: RED,
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            fontFamily: SANS,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
