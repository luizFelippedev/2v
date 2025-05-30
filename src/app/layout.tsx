// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/contexts"; // Importa o provedor combinado
import { Navbar } from "@/components/layout/Navbar";
import "@/styles/globals.css";
import { Footer } from "@/components/layout/Footer";


// Fonte
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
});

// SEO
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev"),
  title: {
    default: "Luiz Felippe - Engenheiro de Software Full Stack",
    template: "%s | Luiz Felippe Portfolio",
  },
  description:
    "Portfolio profissional de Luiz Felippe - Engenheiro de Software Full Stack especializado em React, Node.js, TypeScript e Inteligência Artificial.",
  keywords: [
    "Luiz Felippe",
    "Engenheiro de Software",
    "Full Stack Developer",
    "React",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "Portfolio",
    "São Paulo",
    "Brasil",
  ],
  authors: [
    {
      name: "Luiz Felippe",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev",
    },
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://luizfelippe.dev",
    title: "Luiz Felippe - Engenheiro de Software Full Stack",
    description:
      "Portfolio profissional de Luiz Felippe - Especialista em React, Node.js, TypeScript e IA.",
    siteName: "Luiz Felippe Portfolio",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
  manifest: "/manifest.json",
};

// Viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

// Layout
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground overflow-x-hidden`} suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Pular para o conteúdo principal
        </a>
        <AppProviders>
          <Navbar />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}