"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiDownloadCloud, FiAlertCircle } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import AdBanner from "@/components/AdBanner";
import AdNative from "@/components/AdNative";

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
    <div className="max-w-3xl mx-auto py-10 px-6">
      
      {/* Header */}
      <div className="text-center mb-10">
        <FiDownloadCloud className="text-6xl text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(163,230,53,0.5)]" />
        <h1 className="text-4xl font-extrabold mb-2">Your Link is Almost Ready</h1>
        <p className="text-zinc-400">Please scroll down to find your download link.</p>
      </div>

      {/* --- SCROLL TRAP: Ad Section 1 --- */}
      <div className="space-y-8 mb-20">
        {/* Top Ad Space */}
        <AdBanner id="e2c3ccf3cbe4f40e454a92dcb87306db" width={300} height={250} />

        {/* Direct Link Ads Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="https://directyp.org/4/f0162f5d4136842794d17a1f3da5efa7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-[280px] bg-blue-600 hover:bg-blue-500 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center p-6 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] animate-pulse hover:animate-none cursor-pointer text-white"
          >
             <span className="font-extrabold text-xl mb-1">⚡ FAST DOWNLOAD</span>
             <span className="text-xs text-blue-200">Recommended Secure Server</span>
          </a>

          <a 
            href="https://directyp.org/4/f0162f5d4136842794d17a1f3da5efa7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-[280px] bg-green-600 hover:bg-green-500 border-2 border-green-400 rounded-lg flex flex-col items-center justify-center p-6 transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)] cursor-pointer text-white"
          >
             <span className="font-extrabold text-xl mb-1">⬇️ DOWNLOAD (HD)</span>
             <span className="text-xs text-green-200">High Speed Mirror</span>
          </a>
        </div>
      </div>

      {/* --- SCROLL TRAP: Ad Section 2 --- */}
      <div className="space-y-8 mb-20">
        <AdBanner id="40ed9156f9888c91a58a529315843381" width={728} height={90} />

        <a 
          href="https://directyp.org/4/f0162f5d4136842794d17a1f3da5efa7" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full max-w-[400px] mx-auto bg-orange-600 hover:bg-orange-500 border-2 border-orange-400 rounded-lg p-5 transition-all cursor-pointer text-white shadow-[0_0_15px_rgba(234,88,12,0.3)] text-center"
        >
           <span className="font-extrabold text-lg block">▶ PLAY NOW / STREAM</span>
           <span className="text-xs text-orange-200">No download required</span>
        </a>
        
        <AdNative />
      </div>

      {/* --- SCROLL TRAP: Ad Section 3 --- */}
      <div className="space-y-8 mb-32">
        <a 
          href="https://directyp.org/4/f0162f5d4136842794d17a1f3da5efa7" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full max-w-[400px] mx-auto bg-red-600 hover:bg-red-500 border-2 border-red-400 rounded-lg p-6 transition-all cursor-pointer text-white animate-bounce text-center"
        >
           <span className="font-extrabold text-xl block">🚨 SECURE DOWNLOAD</span>
           <span className="text-sm text-red-200">Premium Server [Ad-Free]</span>
        </a>

        <AdBanner id="e2c3ccf3cbe4f40e454a92dcb87306db" width={300} height={250} />
      </div>

      {/* --- ACTUAL DOWNLOAD SECTION (Bottom) --- */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-10 text-center shadow-2xl backdrop-blur-sm relative overflow-hidden mt-20 mb-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <h2 className="text-2xl font-bold mb-8">Your Real Download Link</h2>

        {!canDownload ? (
          <div className="space-y-4">
            <p className="text-lg text-zinc-300">Please wait while we prepare your secure download...</p>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-zinc-800 relative mx-auto my-6">
              <span className="text-5xl font-black text-white">{countdown}</span>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="60" fill="none" stroke="currentColor" strokeWidth="6" className="text-primary" strokeDasharray="377" strokeDashoffset={377 - (377 * ((15 - countdown) / 15))} style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
            </div>
            <p className="text-sm text-zinc-500">Seconds remaining</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up py-8">
            <p className="text-xl text-primary font-bold mb-6">Your link is ready!</p>
            <button 
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90 text-black px-12 py-5 rounded-full font-extrabold text-xl transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(163,230,53,0.5)]"
            >
              Get Download Link
            </button>
          </div>
        )}
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
