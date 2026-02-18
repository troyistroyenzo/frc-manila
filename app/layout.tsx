import type { Metadata } from "next";
import { Koulen } from "next/font/google";
import { LenisProvider } from "@/lib/lenis";
import "./globals.css";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-koulen",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FRC Manila — Founders Running Club",
  description:
    "A movement for movement. Founders Running Club Manila brings together founders, investors, operators, and creators who move with purpose.",
  openGraph: {
    title: "FRC Manila — Founders Running Club",
    description: "A movement for movement. Built for high-value, high-achieving individuals.",
    siteName: "FRC Manila",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={koulen.variable}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
