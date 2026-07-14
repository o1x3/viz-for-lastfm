import type { Metadata, Viewport } from "next";
import { Archivo, Fraunces, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "viz — liner notes for your listening",
    template: "%s · viz",
  },
  description:
    "A liner-notes dashboard for your Last.fm scrobbles. Your listening, pressed & sleeved — bring your own API key; nothing is stored.",
  openGraph: {
    type: "website",
    siteName: "viz",
    title: "viz — liner notes for your listening",
    description:
      "A liner-notes dashboard for your Last.fm scrobbles. Your listening, pressed & sleeved.",
  },
  twitter: {
    card: "summary_large_image",
    title: "viz — liner notes for your listening",
    description:
      "A liner-notes dashboard for your Last.fm scrobbles. Your listening, pressed & sleeved.",
  },
};

export const viewport: Viewport = {
  themeColor: "#12100d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${archivo.variable} ${splineMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
