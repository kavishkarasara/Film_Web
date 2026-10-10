"use client";
import { useEffect, useRef } from "react";

export default function AdNative() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Make sure we only inject the script once
    if (containerRef.current && !containerRef.current.querySelector("script")) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.dataset.cfasync = "false";
      script.src = "https://bancadeltempoidea.org/21/20cee430d122a96c3a01960e74bbed5c";
      
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-6">
      {/* The Adsterra script will look for this exact ID to inject the native ads */}
      <div id="container-20cee430d122a96c3a01960e74bbed5c" ref={containerRef}></div>
    </div>
  );
}
