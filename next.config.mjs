/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: Cloudflare serves the out/ folder as plain files (see wrangler.jsonc).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
