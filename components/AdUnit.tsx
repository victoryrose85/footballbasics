"use client";

import { useEffect, useRef } from "react";
import { AD_CLIENT, AD_SLOTS, type AdSlot } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// Each unit reserves its space before the ad arrives, so nothing on the page shifts when it loads. The rails are
// fixed sizes; the fluid units reserve the height they usually fill at that width (an estimate until there are
// live ads to measure).
const SIZES: Record<AdSlot, { box: React.CSSProperties; attrs: Record<string, string> }> = {
  rightRail: { box: { width: 300, height: 600 }, attrs: {} },
  leftRail: { box: { width: 160, height: 600 }, attrs: {} },
  inPage: { box: { minHeight: 280 }, attrs: { "data-ad-format": "auto", "data-full-width-responsive": "true" } },
  inArticle: { box: { minHeight: "clamp(280px, 60vw, 400px)" }, attrs: { "data-ad-layout": "in-article", "data-ad-format": "fluid" } },
};

export default function AdUnit({ slot, className = "" }: { slot: AdSlot; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Ask for the ad only once the unit is on the page: a rail hidden at this width (display:none, so no size)
  // never requests one, and gets it if the window grows wide enough to show the rail.
  useEffect(() => {
    const el = ref.current!;
    const observer = new ResizeObserver(() => {
      if (!el.offsetWidth) return;
      observer.disconnect();
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense blocked or not loaded yet
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { box, attrs } = SIZES[slot];
  const fixed = "width" in box;
  return (
    <div ref={ref} className={`ad ad-${slot} ${className}`} style={box}>
      <ins
        className="adsbygoogle"
        style={fixed ? { display: "inline-block", ...box } : { display: "block", textAlign: "center", ...box }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOTS[slot]}
        {...attrs}
      />
    </div>
  );
}
