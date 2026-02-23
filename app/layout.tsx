import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AI-Powered Brand Content & Auto-Scheduling",
  description: "AI analyzes your brand DNA and generates professional Instagram & Facebook posts with your logo in seconds. Skip the graphic designer and start scaling.",
  keywords: "AI brand content, Instagram post generator, Facebook post maker, automated social media scheduling, AI graphic design, brand DNA analysis",
  openGraph: {
    title: "AI-Powered Brand Content",
    description: "Generate professional social media posts in seconds with AI. No graphic designer needed.",
    type: "website",
    url: "https://makemyposts.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Social Content",
    description: "AI-generated brand content with auto-scheduling. Scale your Instagram & Facebook presence.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
