import type { Metadata } from "next";
import { Koulen, Barlow_Condensed } from "next/font/google";
import { LenisProvider } from "@/lib/lenis";
import ScrollFadeObserver from "@/components/ScrollFadeObserver";
import "./globals.css";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-koulen",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://frcmanila.com"),
  title: "FRC Manila — Founders Running Club",
  description:
    "A movement for movement. Founders Running Club Manila brings together founders, investors, operators, and creators who move with purpose.",
  openGraph: {
    title: "FRC Manila — Founders Running Club",
    description: "A movement for movement. Built for high-value, high-achieving individuals.",
    siteName: "FRC Manila",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
    url: "https://frcmanila.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "FRC Manila — Founders Running Club",
    description: "A movement for movement. Built for high-value, high-achieving individuals.",
    images: ["/og-image.jpg"],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${koulen.variable} ${barlowCondensed.variable}`}>
      <body>
        <LenisProvider>
          <ScrollFadeObserver />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
