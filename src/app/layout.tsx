import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = { title: "CineVault | Movie Platform", description: "A cinematic movie discovery and download platform." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-outfit antialiased bg-[#0a0a0c] text-white">
        {children}
      </body>
    </html>
  );
}
