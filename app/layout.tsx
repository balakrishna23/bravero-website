import type { Metadata } from "next";
import "./globals.css";

const title = "Bravero.ai - Executive Search & Leadership Advisory";
const description =
  "Executive Search, Leadership Advisory and Strategic Talent Partnerships for organisations across India and global markets.";
const ogImage = "/bravero-handshake-midnight-platinum.webp";
const metadataBase = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : new URL("https://bravero.ai");

export const metadata: Metadata = {
  title,
  description,
  metadataBase,
  openGraph: {
    title,
    description,
    siteName: "Bravero.ai",
    images: [{ url: ogImage }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
