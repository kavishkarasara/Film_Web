"use client";
import { useEffect } from "react";

export default function AdServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Ad SW registered successfully.'))
        .catch((err) => console.error('Ad SW registration failed:', err));
    }
  }, []);
  return null;
}
