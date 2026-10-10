import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AdServiceWorker from "@/components/AdServiceWorker";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = { title: "CineVault | Movie Platform", description: "A cinematic movie discovery and download platform." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="font-outfit antialiased bg-[#0a0a0c] text-white" suppressHydrationWarning>
        <AdServiceWorker />
        <Script id="monetag-ad" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='11997259',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
        {children}
      </body>
    </html>
  );
}
