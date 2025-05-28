// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Configurações básicas do servidor
  serverRuntimeConfig: {
    hostname: '0.0.0.0',
    port: 3000
  },
  
  // Configurações experimentais simplificadas
  experimental: {
    optimizeCss: true,
  },
  
  // Configurações do compilador
  compiler: {
    // Remove console.log em produção
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configurações de imagens
  images: {
    // Domínios permitidos para imagens externas
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Permitir qualquer domínio HTTPS (ajuste conforme necessário)
      }
    ],
    // Desabilitar otimização em desenvolvimento para velocidade
    unoptimized: process.env.NODE_ENV === 'development',
    // Formatos de imagem suportados
    formats: ['image/webp', 'image/avif'],
    // Tamanhos de imagem para responsividade
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Configurações de headers de segurança atualizadas
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: http:",
              "connect-src 'self' http://localhost:5001 ws://localhost:5001 ws://localhost:3000",
              "font-src 'self' data:",
              "frame-src 'self'",
              "media-src 'self'"
            ].join('; ')
          }
        ]
      }
    ]
  },

  // Adicionar proxy para o backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*'
      }
    ]
  },
  
  // Configurações de webpack (se necessário)
  webpack: (config, { dev, isServer }) => {
    // Configurações personalizadas do webpack
    if (!dev && !isServer) {
      // Otimizações para produção no cliente
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname),
      };
    }
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    return config;
  },
  
  // Configurações de redirects (se necessário)
  async redirects() {
    return [
      // Exemplo de redirect
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ];
  },
  
  // Configurações de ambiente
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default-key',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  },
  
  // Configurações de trailingSlash
  trailingSlash: false,
  
  // Configurações de i18n (se necessário)
  // i18n: {
  //   locales: ['pt-BR', 'en'],
  //   defaultLocale: 'pt-BR',
  // },
};

module.exports = withBundleAnalyzer(nextConfig);