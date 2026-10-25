import { SITE } from "@/site.config";

// The AdSense account and its four ad units, from site.config.ts. Auto ads is limited to the anchor ad in the
// AdSense console, so these units are the only in-page ads.
export const AD_CLIENT = SITE.adClient;
export const AD_SLOTS = SITE.adSlots;

export type AdSlot = keyof typeof AD_SLOTS;
