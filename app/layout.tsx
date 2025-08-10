// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderWithToggle from "./components/HeaderWithToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andrew Mudge | Cleared For Cloud",
  description: "From F-35s to AWS, follow the journey of a aspiring cloud architect.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-gray-100 font-sans`}>
        <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
          <HeaderWithToggle />
          {children}
          <footer className="text-center py-6 text-sm text-gray-400 bg-gray-900 border-t border-red-700">
            © 2025 Andrew Mudge | ClearedForCloud.com · Built with Next.js · Deployed on AWS
          </footer>
        </main>
      </body>
    </html>
  );
}

