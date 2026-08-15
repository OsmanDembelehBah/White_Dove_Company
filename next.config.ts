import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { appDir: true },
};
export default nextConfig;
