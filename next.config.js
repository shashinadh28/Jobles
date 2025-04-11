/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lens.usercontent.google.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig; 