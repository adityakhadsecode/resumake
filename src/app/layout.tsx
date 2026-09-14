import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Anti-Slop Resume Builder — 100% Free, Private & ATS-Optimized",
  description:
    "Craft high-impact, ATS-optimized resumes for free. Zero paywalls, no credit cards, no subscriptions, and zero watermarks. Download clean vector PDFs instantly.",
  keywords: [
    "resume builder",
    "free resume builder",
    "ATS resume",
    "no watermark resume",
    "Jake's resume",
    "developer resume",
    "open source resume builder",
  ],
  authors: [{ name: "Anti-Slop Initiative" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
