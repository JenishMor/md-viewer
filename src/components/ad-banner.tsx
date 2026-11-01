"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdBannerProps = {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
};

// Ads are rendered exactly as Google serves them: AdSense policy does not allow
// altering ad appearance (e.g. inverting colours for dark mode).
export function AdBanner({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive = true,
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const ad = adRef.current;
    // Skip empty slots and containers hidden via CSS (e.g. on mobile), which
    // would otherwise raise "No slot size for availableWidth=0".
    if (!dataAdSlot || !ad || ad.innerHTML !== "" || ad.offsetWidth === 0) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [dataAdSlot]);

  if (!dataAdSlot) return null;

  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client="ca-pub-8617635656002994"
        data-ad-slot={dataAdSlot}
        {...(dataAdFormat ? { "data-ad-format": dataAdFormat } : {})}
        data-full-width-responsive={dataFullWidthResponsive}
      />
    </div>
  );
}
