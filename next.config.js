// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configurações de performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react']
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Configurar PWA
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/api/sw'
      }
    ];
  },

  // Otimizações de imagem
  images: {
    domains: ['via.placeholder.com', 'picsum.photos', 'ui-avatars.com'],
    formats: ['image/webp', 'image/avif']
  },

  // Compressão
  compress: true,

  // Bundle analyzer em desenvolvimento
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      if (process.env.NODE_ENV === 'development') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            openAnalyzer: false,
          })
        );
      }
      return config;
    }
  })
};

module.exports = nextConfig;