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
  title: "MitrAI (SafeSpeak) — Real-Time Empathetic Peer Support",
  description: "Privacy-first anonymous peer support platform with emotion-preserving Indic dialect translation, sub-2ms crisis circuit breaker, and zero-trace session security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0B0F19] text-[#F1F5F9] min-h-screen">
        {children}
      </body>
    </html>
  );
}
