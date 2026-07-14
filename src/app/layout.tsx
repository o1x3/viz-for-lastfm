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
    default: "viz — your Last.fm, visualized",
    template: "%s · viz",
  },
  description:
    "A clean dashboard for your Last.fm scrobbles. Sign in with Last.fm; nothing is stored server-side.",
  openGraph: {
    type: "website",
    siteName: "viz",
    title: "viz — your Last.fm, visualized",
    description:
      "A clean dashboard for your Last.fm scrobbles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "viz — your Last.fm, visualized",
    description:
      "A clean dashboard for your Last.fm scrobbles.",
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
