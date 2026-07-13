/**
 * Pure CSS/SVG spinning vinyl record.
 * Server component — the rotation is a CSS animation, the sheen stays
 * fixed (like real light) while the disc and label copy spin beneath it.
 */
export function Vinyl({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square select-none ${className}`} aria-hidden="true">
      <style>{`
        @keyframes vinyl-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .vinyl-disc { animation: none !important; }
        }
      `}</style>

      {/* ambient drop shadow */}
      <div
        className="absolute inset-[6%] rounded-full"
        style={{ boxShadow: "0 40px 120px -24px oklch(0 0 0 / 75%)" }}
      />

      {/* spinning disc */}
      <div
        className="vinyl-disc absolute inset-0 rounded-full"
        style={{
          animation: "vinyl-spin 9s linear infinite",
          background: [
            // track-separation bands
            "radial-gradient(circle at 50% 50%, transparent 0 42.5%, oklch(0 0 0 / 40%) 43% 43.6%, transparent 44.2% 58.5%, oklch(0 0 0 / 40%) 59% 59.6%, transparent 60.2% 74.5%, oklch(0 0 0 / 40%) 75% 75.6%, transparent 76.2%)",
            // fine grooves
            "repeating-radial-gradient(circle at 50% 50%, oklch(1 0 0 / 0%) 0 1.6px, oklch(1 0 0 / 2.5%) 1.6px 2.1px, oklch(0 0 0 / 22%) 2.1px 3.2px)",
            // base shading
            "radial-gradient(circle at 50% 50%, oklch(0.21 0.008 75) 0%, oklch(0.155 0.005 75) 55%, oklch(0.125 0.004 75) 100%)",
          ].join(", "),
        }}
      >
        {/* crimson center label */}
        <div className="absolute top-1/2 left-1/2 h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[inset_0_0_0_1.5px_oklch(0_0_0_/_25%),0_0_0_1px_oklch(0_0_0_/_45%)]">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              <path
                id="vinyl-label-arc"
                d="M 50 50 m -35 0 a 35 35 0 1 1 70 0 a 35 35 0 1 1 -70 0"
                fill="none"
              />
            </defs>
            <text
              fontSize="6"
              letterSpacing="2.4"
              fill="oklch(0.97 0.01 85 / 92%)"
              style={{ fontFamily: "var(--font-spline-mono), monospace" }}
            >
              <textPath href="#vinyl-label-arc">
                SLEEVE · LONG PLAY · 33⅓ RPM · SIDE A · STEREO ·
              </textPath>
            </text>
            <circle
              cx="50"
              cy="50"
              r="18"
              fill="none"
              stroke="oklch(0.97 0.01 85 / 40%)"
              strokeWidth="0.6"
            />
          </svg>
          {/* spindle hole */}
          <div className="absolute top-1/2 left-1/2 h-[10%] w-[10%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background shadow-[inset_0_1px_3px_oklch(0_0_0_/_70%)]" />
        </div>
      </div>

      {/* static sheen — light stays put while the disc turns */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 205deg at 50% 50%, transparent 0deg, oklch(0.93 0.018 85 / 9%) 16deg, oklch(0.93 0.018 85 / 2%) 38deg, transparent 62deg, transparent 172deg, oklch(0.93 0.018 85 / 6%) 198deg, oklch(0.93 0.018 85 / 1.5%) 218deg, transparent 236deg)",
        }}
      />

      {/* rim highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "inset 0 0 0 1px oklch(0.93 0.018 85 / 10%), inset 0 2px 8px oklch(0.93 0.018 85 / 5%)",
        }}
      />
    </div>
  );
}
