"use client";

// global-error can render without the root layout's CSS, so every style
// here is inline — it must never flash unstyled white.

const BG = "#12100d";
const CREAM = "#f0ebdf";
const CRIMSON = "#d5310a";
const MUTED = "rgba(240, 235, 223, 0.55)";

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
          color: CREAM,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <p
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: MUTED,
            margin: 0,
          }}
        >
          Playback error
        </p>
        <h1
          style={{
            margin: "24px 0 0",
            fontSize: "clamp(40px, 8vw, 72px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          Something went wrong.
        </h1>
        <p
          style={{
            margin: "24px 0 0",
            maxWidth: 420,
            color: MUTED,
            fontSize: 17,
            lineHeight: 1.6,
          }}
        >
          An unexpected error occurred. It is usually brief — try again.
        </p>
        {error?.digest ? (
          <p
            style={{
              margin: "16px 0 0",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
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
            marginTop: 40,
            padding: "12px 28px",
            background: CRIMSON,
            color: CREAM,
            border: "none",
            borderRadius: 9999,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
