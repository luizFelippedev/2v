// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import { AppProviders } from "@/contexts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeScript } from "@/contexts/ThemeContext";
import { ThemeSelector } from "@/components/common";
import { Analytics, PWAManager, RegisterSW } from "@/components/common";
import { NoSSR } from "@/components/common";
import { ErrorBoundary } from "@/components/ui";
import { GlobalSearch } from "@/components/common";
import "@/styles/globals.css";

// Configuração da fonte com otimizações
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
});

// Metadados SEO otimizados
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev"),
  
  title: {
    default: "Luiz Felippe - Engenheiro de Software Full Stack",
    template: "%s | Luiz Felippe Portfolio"
  },
  
  description: "Portfolio profissional de Luiz Felippe - Engenheiro de Software Full Stack especializado em React, Node.js, TypeScript e Inteligência Artificial. Criando experiências digitais excepcionais.",
  
  keywords: [
    "Luiz Felippe",
    "Engenheiro de Software",
    "Full Stack Developer",
    "React",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "Inteligência Artificial",
    "Machine Learning",
    "Frontend",
    "Backend",
    "Web Development",
    "Portfolio",
    "São Paulo",
    "Brasil"
  ],
  
  authors: [{
    name: "Luiz Felippe",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev"
  }],
  
  creator: "Luiz Felippe",
  publisher: "Luiz Felippe",
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev",
    title: "Luiz Felippe - Engenheiro de Software Full Stack",
    description: "Portfolio profissional de Luiz Felippe - Especialista em React, Node.js, TypeScript e IA.",
    siteName: "Luiz Felippe Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Luiz Felippe - Portfolio Profissional",
        type: "image/png"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Luiz Felippe - Engenheiro de Software Full Stack",
    description: "Portfolio profissional - Especialista em React, Node.js, TypeScript e IA.",
    creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@luizfelippe",
    images: ["/og-image.png"]
  },
  
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION && {
      google: process.env.GOOGLE_SITE_VERIFICATION
    }),
    other: {
      ...(process.env.FACEBOOK_DOMAIN_VERIFICATION && {
        "facebook-domain-verification": process.env.FACEBOOK_DOMAIN_VERIFICATION
      })
    }
  },
  
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev",
    languages: {
      'pt-BR': process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev",
      'en-US': `${process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev"}/en`,
    },
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#3b82f6' }
    ]
  },

  manifest: '/manifest.json',
  
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent'
  }
};

// Viewport otimizado
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
  colorScheme: 'dark light'
};

// JSON-LD para SEO estruturado
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Luiz Felippe",
  "url": process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev",
  "image": `${process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev"}/og-image.png`,
  "jobTitle": "Engenheiro de Software Full Stack",
  "description": "Engenheiro de Software especializado em React, Node.js, TypeScript e Inteligência Artificial",
  "email": "luizfelippeandrade@outlook.com",
  "telephone": "+55-11-95232-3645",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "São Paulo",
    "addressRegion": "SP", 
    "addressCountry": "BR"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "Freelancer"
  },
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Unesa"
  },
  "knowsAbout": [
    "JavaScript",
    "TypeScript", 
    "React",
    "Node.js",
    "Python",
    "Machine Learning",
    "Web Development",
    "Software Engineering"
  ],
  "sameAs": [
    process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/luizfelippe",
    process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/luizfelippe",
    `https://twitter.com/${(process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@luizfelippe").replace("@", "")}`
  ]
};

// Carregar componentes UI dinamicamente
const DynamicUIComponents = dynamic(() => import('@/components/ui'), {
  ssr: false
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Script de tema para evitar flash */}
        <ThemeScript />

        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        {process.env.GOOGLE_ANALYTICS_ID && (
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        )}

        {/* JSON-LD para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Preconnect para recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      
      <body 
        className={`${inter.className} antialiased bg-background text-foreground overflow-x-hidden`}
        suppressHydrationWarning
      >
        {/* Skip to content para acessibilidade */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50 transition-all duration-200"
        >
          Pular para o conteúdo principal
        </a>

        <ErrorBoundary>
          <AppProviders>
            {/* Navegação principal */}
            <Navbar />
            
            {/* Busca global */}
            <GlobalSearch />

            {/* Conteúdo principal */}
            <main id="main-content" className="min-h-screen">
              {children}
            </main>

            {/* Rodapé */}
            <Footer />

            {/* Componentes não SSR */}
            <NoSSR fallback={null}>
              {/* Seletor de tema */}
              <ThemeSelector />
              
              {/* Analytics - apenas se habilitado */}
              {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_TRACKING === 'true' && (
                <Analytics />
              )}
              
              {/* PWA - apenas se habilitado */}
              {process.env.NEXT_PUBLIC_PWA_ENABLED === 'true' && (
                <PWAManager />
              )}
              
              {/* Service Worker */}
              <RegisterSW />
            </NoSSR>
          </AppProviders>
        </ErrorBoundary>

        {/* Scripts inline para performance */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Critical performance optimizations
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  // Load non-critical resources
                  const link = document.createElement('link');
                  link.rel = 'stylesheet';
                  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
                  document.head.appendChild(link);
                });
              }

              // Service Worker registration fallback
              if ('serviceWorker' in navigator && ${process.env.NEXT_PUBLIC_PWA_ENABLED === 'true'}) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                      ${process.env.NODE_ENV === 'development' ? "console.log('SW registrado:', registration.scope);" : ""}
                    })
                    .catch(error => {
                      ${process.env.NODE_ENV === 'development' ? "console.log('SW falhou:', error);" : ""}
                    });
                });
              }

              // Performance monitoring - apenas em desenvolvimento
              ${process.env.NODE_ENV === 'development' ? `
              if ('PerformanceObserver' in window) {
                const perfObserver = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                      console.log('LCP:', entry.startTime);
                    }
                  }
                });
                perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
              }` : ''}
            `,
          }}
        />
      </body>
    </html>
  );
}