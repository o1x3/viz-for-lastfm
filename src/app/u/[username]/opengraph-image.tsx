import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "viz - Last.fm stats";

const BG = "#0f0f0f";
const PANEL = "#171717";
const BORDER = "rgba(255, 255, 255, 0.08)";
const FG = "#ececec";
const RED = "#e5484d";
const MUTED = "rgba(236, 236, 236, 0.6)";

async function loadFonts() {
  const dir = path.join(process.cwd(), "src/assets/fonts");
  const [regular, semibold] = await Promise.all([
    readFile(path.join(dir, "geist-400.ttf")),
    readFile(path.join(dir, "geist-600.ttf")),
  ]);
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

function Bars() {
  const bars = [
    { h: 96, o: 0.35 },
    { h: 150, o: 0.5 },
    { h: 118, o: 0.4 },
    { h: 210, o: 1 },
    { h: 170, o: 0.6 },
    { h: 132, o: 0.45 },
    { h: 84, o: 0.3 },
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 18,
        padding: "48px 48px 0",
        borderRadius: 12,
        background: PANEL,
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
      }}
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            width: 34,
            height: bar.h,
            borderRadius: "6px 6px 0 0",
            background: bar.o === 1 ? RED : FG,
            opacity: bar.o === 1 ? 1 : bar.o,
          }}
        />
      ))}
    </div>
  );
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  let name = decodeURIComponent(username);
  if (name.length > 24) name = `${name.slice(0, 24)}…`;

  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: BG,
          padding: "72px 80px",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingRight: 64,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 9999,
                background: RED,
              }}
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: FG,
              }}
            >
              viz
            </div>
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 76,
              lineHeight: 1.05,
              color: FG,
              letterSpacing: "-0.03em",
            }}
          >
            {`${name}’s listening`}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 24,
              fontWeight: 400,
              color: MUTED,
            }}
          >
            Your Last.fm, visualized.
          </div>
        </div>
        <Bars />
      </div>
    ),
    { ...size, fonts },
  );
}
