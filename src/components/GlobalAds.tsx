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
    <>
      {/* Adsterra Popunder */}
      <Script id="adsterra-popunder" strategy="afterInteractive" src="https://aarems.org/1/97724ad1e94ee0de622d04ed566a58aa" data-cfasync="false" />
      
      {/* Adsterra Social Bar */}
      <Script id="adsterra-socialbar" strategy="afterInteractive" src="https://bancadeltempoidea.org/14/c1785eedde6b693d4a26fcf573832135" data-cfasync="false" />
    </>
  );
}
