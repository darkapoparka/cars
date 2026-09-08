import { withCMS } from "@repo/cms/next-config";
import { withToolbar } from "@repo/feature-flags/lib/toolbar";
import { config } from "@repo/next-config";
import { withLogging, withSentry } from "@repo/observability/next-config";
import type { NextConfig } from "next";
import { env } from "@/env";

const publicE2E =
  process.env.AUTOMARKET_PUBLIC_E2E === "true" ||
  process.env.NEXT_PUBLIC_AUTOMARKET_PUBLIC_E2E === "true";
const toolbarEnabled = !publicE2E && process.env.NODE_ENV !== "production";
let nextConfig: NextConfig = toolbarEnabled
  ? withToolbar(withLogging(config))
  : withLogging(config);

if (process.env.NODE_ENV !== "production") {
  nextConfig.allowedDevOrigins = ["127.0.0.1"];
  nextConfig.devIndicators = false;
}
if (publicE2E) {
  const publicE2ERunId = (process.env.E2E_PUBLIC_RUN_ID ?? "manual")
    .replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
  const publicE2EMode = process.env.E2E_PUBLIC_MODE === "unavailable" ? "unavailable" : "demo";
  nextConfig.distDir = `.next-public-e2e-${publicE2ERunId}-${publicE2EMode}`;
}
nextConfig.images = nextConfig.images ?? {};
nextConfig.images.remotePatterns = [
  ...(nextConfig.images.remotePatterns ?? []),
  { protocol: "https", hostname: "assets.basehub.com" },
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
  { protocol: "https", hostname: "mobistatic1.focus.bg", pathname: "/mobile/photosorg/**" },
  { protocol: "https", hostname: "mobistatic2.focus.bg", pathname: "/mobile/photosorg/**" },
  { protocol: "https", hostname: "mobistatic3.focus.bg", pathname: "/mobile/photosorg/**" },
  { protocol: "https", hostname: "mobistatic4.focus.bg", pathname: "/mobile/photosorg/**" },
  { protocol: "https", hostname: "cdn2.focus.bg", pathname: "/mobile/photosorg/**" },
];
if (process.env.NODE_ENV === "production") {
  const redirects: NextConfig["redirects"] = async () => [{
    source: "/legal", destination: "/legal/privacy", statusCode: 301
  }];
  nextConfig.redirects = redirects;
}
if (env.VERCEL) nextConfig = withSentry(nextConfig);
export default withCMS(nextConfig);
