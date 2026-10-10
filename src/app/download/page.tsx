"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiDownloadCloud, FiAlertCircle } from "react-icons/fi";
import Navbar from "@/components/Navbar";

function DownloadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);
  const [canDownload, setCanDownload] = useState(false);
  
  const targetUrl = searchParams.get('url');

  useEffect(() => {
    if (!targetUrl) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanDownload(true);
          // Optional: Auto redirect when timer hits 0
          // window.location.href = decodeURIComponent(targetUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl]);

  const handleDownload = () => {
    if (targetUrl) {
      window.location.href = decodeURIComponent(targetUrl);
    }
  };

  if (!targetUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiAlertCircle className="text-6xl text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Invalid Download Link</h2>
        <p className="text-zinc-400">The link you followed is missing the destination URL.</p>
        <button onClick={() => router.back()} className="mt-6 bg-primary text-black px-6 py-2 rounded font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      
      {/* Top Ad Space */}
      <div className="w-full h-24 bg-zinc-900 border border-zinc-700/50 rounded-lg flex flex-col items-center justify-center mb-10 border-dashed relative overflow-hidden group">
        <span className="text-zinc-500 font-semibold text-sm">Top Banner Ad Space (728x90)</span>
        <span className="text-xs text-zinc-600 mt-1">Insert your Ad Network code here later</span>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-10 text-center shadow-2xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <FiDownloadCloud className="text-6xl text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(163,230,53,0.5)]" />
        <h1 className="text-3xl font-extrabold mb-4">Your Link is Almost Ready</h1>
        
        {/* Middle Rectangle Ad */}
        <div className="w-[300px] h-[250px] mx-auto bg-zinc-800/80 border border-zinc-700 rounded-lg flex flex-col items-center justify-center my-8 border-dashed">
           <span className="text-zinc-500 font-semibold text-sm">Square Ad Space (300x250)</span>
           <span className="text-xs text-zinc-600 mt-1">High CTR placement</span>
        </div>

        {!canDownload ? (
          <div className="space-y-4">
            <p className="text-lg text-zinc-300">Please wait while we prepare your secure download...</p>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-zinc-800 relative">
              <span className="text-4xl font-black text-white">{countdown}</span>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="44" cy="44" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" strokeDasharray="276" strokeDashoffset={276 - (276 * ((15 - countdown) / 15))} style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
            </div>
            <p className="text-sm text-zinc-500">Seconds remaining</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            <p className="text-lg text-primary font-semibold">Your link is ready!</p>
            <button 
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90 text-black px-10 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(163,230,53,0.4)]"
            >
              Get Download Link
            </button>
          </div>
        )}
      </div>

      {/* Bottom Ad Space */}
      <div className="w-full h-24 bg-zinc-900 border border-zinc-700/50 rounded-lg flex flex-col items-center justify-center mt-10 border-dashed">
        <span className="text-zinc-500 font-semibold text-sm">Bottom Banner Ad Space</span>
      </div>

    </div>
  );
}

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans selection:bg-primary/30">
      <Navbar />
      <Suspense fallback={<div className="flex justify-center py-32">Loading...</div>}>
        <DownloadContent />
      </Suspense>
    </div>
  );
}
