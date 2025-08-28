import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Allow cross-origin requests from the development environment.
  // This is necessary for the preview to work correctly.
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      allowedDevOrigins: [
        // This is the origin of the iframe that loads the preview.
        // It's the same for all users.
        'https://6000-firebase-studio-1756330846321.cluster-ulqnojp5endvgve6krhe7klaws.cloudworkstations.dev',
      ],
    },
  }),
};

export default nextConfig;
