import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "viz: your Last.fm, visualized",
    template: "%s · viz",
  },
  description:
    "A clean dashboard for your Last.fm scrobbles. Sign in with Last.fm; nothing is stored server side.",
  openGraph: {
    type: "website",
    siteName: "viz",
    title: "viz: your Last.fm, visualized",
    description: "A clean dashboard for your Last.fm scrobbles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "viz: your Last.fm, visualized",
    description: "A clean dashboard for your Last.fm scrobbles.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
