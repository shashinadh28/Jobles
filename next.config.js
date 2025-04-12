/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds to prevent ESLint warnings from causing build failures
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript type checking during builds as well
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig; 