import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bravero.ai — Executive Search & Leadership Advisory",
  description:
    "Executive Search, Leadership Advisory and Strategic Talent Partnerships for organisations across India and global markets.",
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
