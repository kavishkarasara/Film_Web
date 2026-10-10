"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function GlobalAds() {
  const pathname = usePathname();

  // ONLY show ads on the download page
  const shouldShowAds = pathname?.startsWith('/download');

  useEffect(() => {
    // Only register service worker if ads are allowed on this page
    if (shouldShowAds && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Ad SW registered successfully.'))
        .catch((err) => console.error('Ad SW registration failed:', err));
    }
  }, [shouldShowAds]);

  // Disable ads on all other pages
  if (!shouldShowAds) {
    return null;
  }

  return (
    <Script id="monetag-ad" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='11997259',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
  );
}
