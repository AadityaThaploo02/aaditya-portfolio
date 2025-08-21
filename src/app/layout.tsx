// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aadityathaploo.com"),
  title: {
    default: "Aaditya Thaploo – Portfolio",
    template: "%s | Aaditya Thaploo",
  },
  description:
    "MS CS @ Purdue. Software Engineering • Cybersecurity • ML/AI • Data Engineering • Automation.",
  openGraph: {
    url: "https://aadityathaploo.com",
    title: "Aaditya Thaploo – Portfolio",
    description:
      "Software Engineering • Cybersecurity • ML/AI • Data Engineering.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    siteName: "Aaditya Thaploo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaditya Thaploo – Portfolio",
    description:
      "Software Engineering • Cybersecurity • ML/AI • Data Engineering.",
    images: ["/og.png"],
  },
  alternates: { canonical: "https://aadityathaploo.com" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
