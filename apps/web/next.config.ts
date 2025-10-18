import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev({
  configPath: './wrangler.jsonc',
  persist: {path: '../../.wrangler/state/v3'}
});

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true,
  serverExternalPackages: ['@react-pdf/renderer', 'pdfjs-dist', 'react-pdf/dist/esm/Page/TextLayer.css'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
