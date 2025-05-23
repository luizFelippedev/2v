/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables for client-side
  env: {
    CUSTOM_KEY: 'portfolio-value',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  },
  
  // Images configuration
  images: {
    domains: [
      'picsum.photos',
      'via.placeholder.com',
      'ui-avatars.com',
      'localhost',
    ],
    formats: ['image/webp'],
  },
  
  // Add support for service worker
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options', 
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Experimental features
  experimental: {
    // Server Actions are enabled by default in Next.js 14
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/placeholder/:width/:height',
        destination: '/api/placeholder/:width/:height',
        permanent: true,
      },
    ];
  },
  
  // Output settings
  output: 'standalone',
  
  // Disable React StrictMode if causing issues with animations
  // reactStrictMode: false,
  
  // Trailing slash settings
  trailingSlash: false,
  
  // Powered by header
  poweredByHeader: false,
};

module.exports = nextConfig;