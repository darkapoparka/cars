const dealer = require('./lib/dealer.json');
const stock = require('./lib/dealer-inventory.json');
const imports = require('./lib/dealer-import-inventory.json');
const media = [...Object.values(dealer.logo), ...[...stock, ...imports.map(row => row.vehicle)].flatMap(vehicle => [vehicle.image, ...(vehicle.images || [])])];
// Only explicitly configured HTTPS origins can use the image optimizer.
const origins = [...new Set(media.filter(value => typeof value === 'string' && /^https:/i.test(value)).map(value => new URL(value).origin))];
const remotePatterns = origins.map(origin => {const url = new URL(origin); return {protocol: 'https', hostname: url.hostname, port: url.port, pathname: '/**'};});

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  distDir: process.env.NEXT_DIST_DIR || '.next',
  devIndicators: false,
  // Serve retained images directly on the mounted dealer Services routes.
  images: {unoptimized: Boolean(process.env.NEXT_PUBLIC_BASE_PATH), remotePatterns},
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
