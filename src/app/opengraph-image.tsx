import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "viz — liner notes for your Last.fm";

const BG = "#12100d";
const CREAM = "#f0ebdf";
const CRIMSON = "#d5310a";
const MUTED = "rgba(240, 235, 223, 0.55)";

async function loadFonts() {
  const dir = path.join(process.cwd(), "src/assets/fonts");
  const [fraunces, archivo] = await Promise.all([
    readFile(path.join(dir, "fraunces-600.ttf")),
    readFile(path.join(dir, "archivo-400.ttf")),
  ]);
  return [
    { name: "Fraunces", data: fraunces, weight: 600 as const, style: "normal" as const },
    { name: "Archivo", data: archivo, weight: 400 as const, style: "normal" as const },
  ];
}

function Vinyl() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 420,
        height: 420,
        borderRadius: 9999,
        background: "#1c1813",
        border: `1px solid rgba(240, 235, 223, 0.14)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 330,
          height: 330,
          borderRadius: 9999,
          border: `1px solid rgba(240, 235, 223, 0.22)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 240,
            height: 240,
            borderRadius: 9999,
            border: `1px solid rgba(240, 235, 223, 0.22)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 140,
              height: 140,
              borderRadius: 9999,
              background: CRIMSON,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 9999,
                background: BG,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function OpengraphImage() {
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
          fontFamily: "Fraunces",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingRight: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 9999,
                background: CRIMSON,
              }}
            />
            <div
              style={{
                fontFamily: "Archivo",
                fontSize: 17,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              viz — liner notes for your Last.fm
            </div>
          </div>
          <div
            style={{
              fontFamily: "Fraunces",
              fontWeight: 600,
              fontSize: 96,
              lineHeight: 1.02,
              color: CREAM,
              letterSpacing: "-0.02em",
            }}
          >
            Your listening, pressed &amp; sleeved.
          </div>
          <div
            style={{
              marginTop: 36,
              width: 120,
              height: 2,
              background: "rgba(240, 235, 223, 0.25)",
            }}
          />
        </div>
        <Vinyl />
      </div>
    ),
    { ...size, fonts },
  );
}
