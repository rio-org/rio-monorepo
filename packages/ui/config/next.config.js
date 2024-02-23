
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@rio-monorepo/ui'],
  productionBrowserSourceMaps: process.env.CI === 'true',
  webpack: (config) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    config.resolve.fallback = { fs: false, net: false, tls: false };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  }
};

module.exports = nextConfig;
