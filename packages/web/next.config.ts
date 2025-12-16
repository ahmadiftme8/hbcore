import type { NextConfig } from 'next';

// Next.js automatically loads .env, .env.local, .env.production files
// NEXT_PUBLIC_ variables are embedded at build time
// No need to manually load them here

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@hbcore/types'],
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85],

    // Added the S3 bucket domain here so Next.js Image component can optimize our assets
    // The hostname comes from our ArvanCloud bucket details
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hbcore-dev.s3.ir-thr-at1.arvanstorage.ir',
        port: '',
        pathname: '/**', // Allow access to all paths in the bucket
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-slot',
    ],
  },
};

export default nextConfig;