"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import AdNative from "@/components/AdNative";

function GateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrl = searchParams.get("url") || "";
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSkip = () => {
    router.push(`/download?url=${encodeURIComponent(targetUrl)}`);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 min-h-screen flex flex-col items-center">
      
      {/* Top Bar with Skip Button */}
      <div className="w-full flex justify-between items-center mb-8 bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-lg sticky top-4 z-50">
        <div className="text-xl font-black tracking-widest text-zinc-600">ADVERTISEMENT</div>
        {!canSkip ? (
          <div className="text-white font-bold bg-zinc-800 px-6 py-3 rounded-lg border border-zinc-700">
            Please wait <span className="text-primary text-xl ml-1">{countdown}</span>s...
          </div>
        ) : (
          <button 
            onClick={handleSkip} 
            className="bg-primary hover:bg-primary/90 text-black px-8 py-3 rounded-lg font-extrabold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(163,230,53,0.5)] flex items-center gap-2"
          >
            Skip Ad ➔
          </button>
        )}
      </div>

      {/* Heavy Ads Content */}
      <div className="w-full space-y-10">
        <AdBanner id="40ed9156f9888c91a58a529315843381" width={728} height={90} />
        
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center">
          <AdBanner id="e2c3ccf3cbe4f40e454a92dcb87306db" width={300} height={250} />
          
          <a 
            href="https://directyp.org/4/f0162f5d4136842794d17a1f3da5efa7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full max-w-[300px] h-[250px] bg-red-600 hover:bg-red-500 border-4 border-red-400 rounded-lg p-6 transition-all cursor-pointer text-white animate-pulse flex flex-col items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          >
            <span className="font-extrabold text-3xl block text-center mb-2">🚨 START SECURE DOWNLOAD</span>
            <span className="text-sm text-red-200">Recommended Ad-Free Server</span>
          </a>

          <AdBanner id="e2c3ccf3cbe4f40e454a92dcb87306db" width={300} height={250} />
        </div>

        <AdNative />

        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <a 
            href="https://directyp.org/4/f0162f5d4136842794d17a1f3da5efa7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 hover:bg-blue-500 border-2 border-blue-400 rounded-lg p-8 text-center text-white"
          >
            <span className="font-extrabold text-2xl block mb-2">▶ WATCH HD MOVIE</span>
            <span className="text-blue-200">Stream directly in browser</span>
          </a>
          <a 
            href="https://directyp.org/4/f0162f5d4136842794d17a1f3da5efa7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 hover:bg-green-500 border-2 border-green-400 rounded-lg p-8 text-center text-white"
          >
            <span className="font-extrabold text-2xl block mb-2">⬇ FAST DOWNLOAD SERVER 2</span>
            <span className="text-green-200">High speed alternative link</span>
          </a>
        </div>

        <AdBanner id="40ed9156f9888c91a58a529315843381" width={728} height={90} />
        
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center">
          <AdBanner id="e2c3ccf3cbe4f40e454a92dcb87306db" width={300} height={250} />
          <AdBanner id="e2c3ccf3cbe4f40e454a92dcb87306db" width={300} height={250} />
        </div>
      </div>
      
    </div>
  );
}

export default function GatePage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white font-sans selection:bg-primary/30">
      {/* Intentionally no Navbar here to make it look like a pure ad page */}
      <Suspense fallback={<div className="flex justify-center py-32 text-zinc-500">Loading secure link...</div>}>
        <GateContent />
      </Suspense>
    </div>
  );
}
