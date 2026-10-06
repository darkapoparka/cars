/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  distDir: process.env.NEXT_DIST_DIR || '.next',
  devIndicators: false,
  // Serve retained images directly on the mounted dealer Services routes.
  images: { unoptimized: Boolean(process.env.NEXT_PUBLIC_BASE_PATH) },
};

// Each isolated QA check has its own output directory and no warm-cache reuse.
const isolatedQaBuild = /(?:^|[\\/])(?:next-check|\.next-build[^\\/]*|\.next-qa[^\\/]*)$/.test(
  nextConfig.distDir,
);
if (isolatedQaBuild) {
  nextConfig.experimental = { turbopackFileSystemCacheForBuild: false };
  nextConfig.turbopack = {};
  nextConfig.webpack = (config, { dev }) => {
    if (!dev) config.cache = false;
    return config;
  };
}
module.exports = nextConfig;
