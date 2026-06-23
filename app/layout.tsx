import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "People's Priorities – AI Constituency Development Platform",
  description: "An AI-powered multilingual governance dashboard for Members of Parliament and citizens to analyze public feedback, categorize developmental issues, and coordinate local projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen relative`}
      >
        {/* Persistent animated mesh background */}
        <div className="mesh-bg" />
        
        {/* Header navigation */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow flex flex-col w-full">
          {children}
        </main>
        
        {/* Page Footer */}
        <Footer />
      </body>
    </html>
  );
}
