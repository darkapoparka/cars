/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  distDir: process.env.NEXT_DIST_DIR || '.next',
};
module.exports = nextConfig;
