// Google Consent Mode defaults and the "Privacy & cookie choices" link.
// Google's Privacy & messaging consent tool (loaded by the AdSense script) shows the consent messages
// and updates these defaults once a visitor answers.

import { SITE } from "@/site.config";

export const GA_ID = SITE.gaId;

// The EEA (EU27 plus Iceland, Liechtenstein and Norway), the UK and Switzerland: visitors here start denied.
export const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU",
  "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

export const GTAG_INIT =
  "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}" +
  "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'," +
  `analytics_storage:'denied',region:${JSON.stringify(CONSENT_REGIONS)},wait_for_update:500});` +
  `gtag('js',new Date());gtag('config','${GA_ID}');`;

// The parts of Google's Privacy & messaging JavaScript API this site uses
// (https://developers.google.com/funding-choices/fc-api-docs). Callbacks go on its queue as { KEY: fn }.
type FcCallback = Partial<Record<"CONSENT_API_READY" | "INITIAL_US_STATES_OPT_OUT_DATA_READY", () => void>>;
interface Googlefc {
  callbackQueue?: { push(cb: FcCallback): void } | FcCallback[];
  showRevocationMessage?(): void;
  usstatesoptout?: {
    InitialUsStatesOptOutStatusEnum: { UNKNOWN: number; DOES_NOT_APPLY: number };
    getInitialUsStatesOptOutStatus(): number;
    openConfirmationDialog(callback: (optedOut: boolean) => void): void;
  };
}
type TcfApi = (command: "addEventListener", version: 0, cb: (tcdata: { gdprApplies?: boolean } | null, success: boolean) => void) => void;
type FcWindow = Window & { googlefc?: Googlefc; __tcfapi?: TcfApi };

// Which consent choice applies to this visitor: the US "do not sell or share" dialog in a US state with a
// privacy law, or the European consent message where EU rules apply.
export type PrivacyChoice = "us" | "eu";

// Asks Google's tool which choice applies and calls onChoice once it knows. Visitors with neither, or with
// the tool blocked (an ad blocker, say), never get a call, so the link keeps going to the privacy policy.
// The queue is created here if the tool hasn't loaded yet; the tool runs it when it does.
export function watchPrivacyChoice(onChoice: (choice: PrivacyChoice) => void): void {
  const w = window as FcWindow;
  const fc = (w.googlefc = w.googlefc || {});
  fc.callbackQueue = fc.callbackQueue || [];
  fc.callbackQueue.push({
    INITIAL_US_STATES_OPT_OUT_DATA_READY: () => {
      const us = fc.usstatesoptout;
      if (!us) return;
      const status = us.getInitialUsStatesOptOutStatus();
      const { UNKNOWN, DOES_NOT_APPLY } = us.InitialUsStatesOptOutStatusEnum;
      if (status !== UNKNOWN && status !== DOES_NOT_APPLY) onChoice("us");
    },
  });
  fc.callbackQueue.push({
    CONSENT_API_READY: () =>
      w.__tcfapi?.("addEventListener", 0, (tcdata, success) => {
        if (success && tcdata?.gdprApplies) onChoice("eu");
      }),
  });
}

// Reopens the choice watchPrivacyChoice found.
export function openPrivacyChoices(choice: PrivacyChoice): void {
  const fc = (window as FcWindow).googlefc;
  if (choice === "us") fc?.usstatesoptout?.openConfirmationDialog(() => {});
  else fc?.showRevocationMessage?.();
}
