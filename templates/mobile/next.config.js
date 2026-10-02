const fs = require('node:fs');
const path = require('node:path');
const crossDriveDependencies =
  process.platform === 'win32' &&
  path.parse(fs.realpathSync(path.join(__dirname, 'node_modules'))).root.toLowerCase() !==
    path.parse(__dirname).root.toLowerCase();

/** @type {import('next').NextConfig} */
module.exports = {
  devIndicators: false,
  agentRules: false,
  poweredByHeader: false,
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: { cpus: 2 },
  images: { unoptimized: true },
  webpack(config) {
    // Keep large local webpack caches off a full source drive without moving dev route output.
    if (process.env.NEXT_WEBPACK_CACHE_DIR && config.cache?.type === 'filesystem') {
      config.cache.cacheDirectory = path.resolve(process.env.NEXT_WEBPACK_CACHE_DIR);
    }
    if (crossDriveDependencies) {
      config.resolve.symlinks = false;
      config.resolveLoader.symlinks = false;
    }
    return config;
  },
};
