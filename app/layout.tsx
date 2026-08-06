import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bravero.ai"),
  applicationName: "Bravero",
  title: "Bravero | Executive Search & Leadership Advisory",
  description:
    "Senior-led executive search for C-suite, GCC and business leadership appointments across India and global markets.",
  keywords: [
    "executive search India",
    "leadership hiring",
    "C-suite recruitment",
    "GCC leadership hiring",
    "leadership advisory",
  ],
  authors: [{ name: "Bravero" }],
  creator: "Bravero",
  publisher: "Bravero",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Bravero",
    title: "Bravero | Executive Search & Leadership Advisory",
    description:
      "Senior-led executive search for C-suite, GCC and business leadership appointments across India and global markets.",
    images: [
      {
        url: "/og-bravero.png",
        width: 1200,
        height: 630,
        alt: "Bravero executive search and leadership advisory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bravero | Executive Search & Leadership Advisory",
    description:
      "Senior-led executive search for C-suite, GCC and business leadership appointments across India and global markets.",
    images: ["/og-bravero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "PE1uKmRlW4CrbibzZekcYipmDK36hgr-RdmQ7Z1Tp7Y",
  },
  formatDetection: {
    telephone: false,
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
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Bravero",
              url: "https://bravero.ai",
              logo: "https://bravero.ai/favicon.svg",
              email: "talent.connect@bravero.ai",
              description:
                "Executive search and leadership advisory for C-suite, GCC and business leadership appointments across India and global markets.",
            }),
          }}
        />
      </body>
    </html>
  );
}
