"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function GlobalAds() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname?.startsWith('/admin') && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Ad SW registered successfully.'))
        .catch((err) => console.error('Ad SW registration failed:', err));
    }
  }, [pathname]);

  // Disable ads on the Admin Panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <Script id="monetag-ad" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='11997259',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
  );
}
