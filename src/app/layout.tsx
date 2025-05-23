// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { AppProviders } from "@/contexts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeScript } from "@/contexts/ThemeContext";
import { ThemeSelector } from "@/components/common/ThemeSelector";
import { Analytics } from "@/components/common/Analytics";
import { PWA } from "@/components/common/PWA";
import { NoSSR } from "@/components/common/NoSSR";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { GlobalSearch } from "@/components/common/GlobalSearch";

// Configuração da fonte
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Metadados SEO
export const metadata: Metadata = {
  title: {
    default: "Luiz Felippe - Portfolio Profissional",
    template: "%s | Luiz Felippe Portfolio"
  },
  description: "Portfolio profissional de Luiz Felippe - Desenvolvedor Full Stack especializado em React, Node.js e IA. Criando experiências digitais excepcionais.",
  keywords: [
    "portfolio",
    "desenvolvedor",
    "full stack",
    "react",
    "nodejs",
    "typescript",
    "inteligência artificial",
    "frontend",
    "backend",
    "engenheiro de software"
  ],
  authors: [{ name: "Luiz Felippe", url: "https://luizfelippe.dev" }],
  creator: "Luiz Felippe",
  metadataBase: new URL("https://luizfelippe.dev"),
  
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://luizfelippe.dev",
    title: "Luiz Felippe - Portfolio Profissional",
    description: "Portfolio profissional de Luiz Felippe - Desenvolvedor Full Stack especializado em React, Node.js e IA.",
    siteName: "Luiz Felippe Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Luiz Felippe - Portfolio"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Luiz Felippe - Portfolio Profissional",
    description: "Portfolio profissional de Luiz Felippe - Desenvolvedor Full Stack especializado em React, Node.js e IA.",
    creator: "@luizfelippe",
    images: ["/og-image.png"]
  },
  
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
  
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? '',
    other: {
      "facebook-domain-verification": process.env.FACEBOOK_DOMAIN_VERIFICATION ?? ''
    }
  },
  
  alternates: {
    canonical: "https://luizfelippe.dev",
    languages: {
      'pt-BR': 'https://luizfelippe.dev/pt-BR',
      'en-US': 'https://luizfelippe.dev/en-US',
    },
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
    other: [
      {
        rel: 'manifest',
        url: '/manifest.json'
      }
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning={true}
    >
      <head>
        {/* Theme Script para carregamento inicial de tema */}
        <ThemeScript />

        {/* Preload de recursos críticos */}
        <link 
          rel="preload" 
          href="/fonts/inter-var.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />

        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      
      <body 
        className={`${inter.className} antialiased bg-background text-foreground`}
        suppressHydrationWarning={true}
      >
        {/* Tratamento de erros */}
        <ErrorBoundary>
          {/* Provedor de contextos */}
          <AppProviders>
            {/* Navegação principal */}
            <Navbar />
            
            {/* Busca global */}
            <GlobalSearch />

            {/* Conteúdo principal */}
            <main>{children}</main>

            {/* Rodapé */}
            <Footer />

            {/* Componentes não SSR */}
            <NoSSR>
              {/* Seletor de tema */}
              <ThemeSelector />
              
              {/* Análises */}
              <Analytics />
              
              {/* PWA */}
              <PWA />
            </NoSSR>
          </AppProviders>
        </ErrorBoundary>

        {/* Script de suporte a PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('ServiceWorker registration failed: ', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

// Configurações de segurança de cabeçalhos
export const headers = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
};