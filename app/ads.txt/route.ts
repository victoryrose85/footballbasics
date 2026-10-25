import { AD_CLIENT } from "@/lib/ads";

export const dynamic = "force-static";

// ads.txt names the AdSense account allowed to sell this site's ad space, written from SITE.adClient.
export function GET() {
  const line = `google.com, ${AD_CLIENT.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(line, { headers: { "Content-Type": "text/plain" } });
}
