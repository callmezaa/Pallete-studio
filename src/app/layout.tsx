import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeBackground } from "@/components/ui/ThemeBackground";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { ShortcutLayer } from "@/components/ui/ShortcutLayer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Palette Studio",
  description: "Discover the visual identity hidden inside every image.",
  metadataBase: new URL("https://palettestudio.app"),
  openGraph: {
    title: "Palette Studio",
    description: "Discover the visual identity hidden inside every image.",
    url: "https://palettestudio.app",
    siteName: "Palette Studio",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palette Studio",
    description: "Discover the visual identity hidden inside every image.",
    images: ["/og-image.svg"],
  },
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans`}>
        <ThemeBackground />
        {children}
        <ToastContainer />
        <ShortcutLayer />
      </body>
    </html>
  );
}
