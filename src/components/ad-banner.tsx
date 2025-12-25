/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type AdBannerProps = {
  dataAdSlot: string
  dataAdFormat?: string
  dataFullWidthResponsive?: boolean
  className?: string
}

export function AdBanner({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive = true,
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      // Check if the ad has already been loaded in this container
      if (adRef.current && adRef.current.innerHTML === "") {
        // Only initialize if the container is visible (has width)
        // This prevents "No slot size for availableWidth=0" error when hidden via CSS (e.g. on mobile)
        if (adRef.current.offsetWidth > 0) {
          window.adsbygoogle = window.adsbygoogle || []
          window.adsbygoogle.push({})
        }
      }
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [resolvedTheme, mounted])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <ins
        key={resolvedTheme}
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: "block", 
          width: "100%", 
          height: "100%",
          filter: isDark ? "invert(1) hue-rotate(180deg)" : "none"
        }}
        data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? ""}`}
        data-ad-slot={dataAdSlot}
        {...(dataAdFormat ? { "data-ad-format": dataAdFormat } : {})}
        data-full-width-responsive={dataFullWidthResponsive}
      />
    </div>
  )
}
