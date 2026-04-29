import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.trycloudflare.com'],
  experimental: {
    serverActions: {
      allowedOrigins: ['*.trycloudflare.com'],
    },
  },
};

export default nextConfig;