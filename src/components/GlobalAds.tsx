"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function GlobalAds() {
  const pathname = usePathname();

  // Show ads everywhere EXCEPT the home page ('/') and admin panel ('/admin')
  const shouldShowAds = pathname !== '/' && !pathname?.startsWith('/admin');

  useEffect(() => {
    // Only register service worker if ads are allowed on this page
    if (shouldShowAds && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Ad SW registered successfully.'))
        .catch((err) => console.error('Ad SW registration failed:', err));
    }
  }, [shouldShowAds]);

  // Disable ads on specific pages
  if (!shouldShowAds) {
    return null;
  }

  return (
    <Script id="monetag-ad" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='11997259',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
  );
}
