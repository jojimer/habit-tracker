/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Simplified webpack configuration with more reliable caching
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Disable filesystem cache in development to prevent ENOENT errors
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;