/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Serve retained images directly on the mounted dealer Services routes.
  images: { unoptimized: Boolean(process.env.NEXT_PUBLIC_BASE_PATH) },
};
module.exports = nextConfig;
