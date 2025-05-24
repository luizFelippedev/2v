// src/hooks/useAdvancedHooks.ts - Hooks avançados para o portfolio

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// Hook para gerenciamento avançado de performance
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<{
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
    memoryUsage?: number;
    renderTime?: number;
  }>({});

  const [score, setScore] = useState<number>(0);
  const renderStartTime = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Medir tempo de renderização
    const renderTime = Date.now() - renderStartTime.current;
    setMetrics(prev => ({ ...prev, renderTime }));

    // Performance Observer para Core Web Vitals
    const observePerformance = () => {
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            const fid = entry.processingStart - entry.startTime;
            setMetrics(prev => ({ ...prev, fid }));
          });
        });

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              setMetrics(prev => ({ ...prev, cls: clsValue }));
            }
          });
        });

        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          fidObserver.observe({ entryTypes: ['first-input'] });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Performance Observer não suportado:', error);
        }

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      }
    };

    // Medir uso de memória
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({ 
          ...prev, 
          memoryUsage: memory.usedJSHeapSize / memory.totalJSHeapSize 
        }));
      }
    };

    // Medir TTFB
    const measureTTFB = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        setMetrics(prev => ({ ...prev, ttfb }));
      }
    };

    // Medir FCP
    const measureFCP = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    };

    const cleanup = observePerformance();
    measureMemory();
    measureTTFB();
    measureFCP();

    // Atualizar métricas periodicamente
    const interval = setInterval(() => {
      measureMemory();
    }, 10000);

    return () => {
      cleanup?.();
      clearInterval(interval);
    };
  }, []);

  // Calcular score de performance
  useEffect(() => {
    let calculatedScore = 100;

    // LCP scoring
    if (metrics.lcp) {
      if (metrics.lcp > 4000) calculatedScore -= 30;
      else if (metrics.lcp > 2500) calculatedScore -= 15;
    }

    // FID scoring
    if (metrics.fid) {
      if (metrics.fid > 300) calculatedScore -= 25;
      else if (metrics.fid > 100) calculatedScore -= 10;
    }

    // CLS scoring
    if (metrics.cls) {
      if (metrics.cls > 0.25) calculatedScore -= 25;
      else if (metrics.cls > 0.1) calculatedScore -= 10;
    }

    // Memory usage scoring
    if (metrics.memoryUsage) {
      if (metrics.memoryUsage > 0.8) calculatedScore -= 10;
      else if (metrics.memoryUsage > 0.6) calculatedScore -= 5;
    }

    setScore(Math.max(0, calculatedScore));
  }, [metrics]);

  return { metrics, score };
}

// Hook para gerenciamento de tema avançado
export function useAdvancedTheme() {
  const [isDark, setIsDark] = useState(false);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');
  const [userPreference, setUserPreference] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    // Detectar preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    // Carregar preferência salva
    const saved = localStorage.getItem('theme-preference');
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      setUserPreference(saved as 'light' | 'dark' | 'system');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const effectiveTheme = userPreference === 'system' ? systemTheme : userPreference;
    setIsDark(effectiveTheme === 'dark');

    // Aplicar ao DOM
    document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    
    // Atualizar meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#0f172a' : '#ffffff');
    }
  }, [userPreference, systemTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    setUserPreference(newTheme);
    localStorage.setItem('theme-preference', newTheme);
  }, [isDark]);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    setUserPreference(theme);
    localStorage.setItem('theme-preference', theme);
  }, []);

  return {
    isDark,
    systemTheme,
    userPreference,
    toggleTheme,
    setTheme,
  };
}

// Hook para otimização de imagens
export function useImageOptimization() {
  const [supportsWebP, setSupportsWebP] = useState(false);
  const [supportsAVIF, setSupportsAVIF] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast'>('fast');

  useEffect(() => {
    // Detectar suporte a formatos modernos
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    const checkAVIFSupport = () => {
      return new Promise<boolean>((resolve) => {
        const avif = new Image();
        avif.onload = () => resolve(true);
        avif.onerror = () => resolve(false);
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      });
    };

    // Detectar velocidade da conexão
    const checkConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection.effectiveType;
        setConnectionSpeed(['slow-2g', '2g'].includes(effectiveType) ? 'slow' : 'fast');
      }
    };

    setSupportsWebP(checkWebPSupport());
    checkAVIFSupport().then(setSupportsAVIF);
    checkConnectionSpeed();
  }, []);

  const getOptimizedImageUrl = useCallback((src: string, width: number, height: number, quality = 75) => {
    if (!src) return '';

    // Se for uma URL externa, retorna como está
    if (src.startsWith('http') && !src.includes(window.location.hostname)) {
      return src;
    }

    // Constrói URL otimizada
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      h: height.toString(),
      q: quality.toString(),
    });

    if (supportsAVIF) {
      params.set('f', 'avif');
    } else if (supportsWebP) {
      params.set('f', 'webp');
    }

    // Reduzir qualidade para conexões lentas
    if (connectionSpeed === 'slow') {
      params.set('q', '50');
    }

    return `/api/image-proxy?${params.toString()}`;
  }, [supportsWebP, supportsAVIF, connectionSpeed]);

  return {
    supportsWebP,
    supportsAVIF,
    connectionSpeed,
    getOptimizedImageUrl,
  };
}

// Hook para análise de comportamento do usuário
export function useUserAnalytics() {
  const [sessionData, setSessionData] = useState({
    startTime: Date.now(),
    pageViews: 0,
    timeOnPage: 0,
    scrollDepth: 0,
    clickCount: 0,
    lastActivity: Date.now(),
  });

  const router = useRouter();

  useEffect(() => {
    let timeInterval: NodeJS.Timeout;
    let lastScrollY = 0;

    // Rastrear tempo na página
    const updateTimeOnPage = () => {
      setSessionData(prev => ({
        ...prev,
        timeOnPage: Date.now() - prev.startTime,
      }));
    };

    // Rastrear profundidade de scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((currentScrollY / maxScrollY) * 100);

      setSessionData(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, scrollDepth),
        lastActivity: Date.now(),
      }));
    };

    // Rastrear cliques
    const handleClick = () => {
      setSessionData(prev => ({
        ...prev,
        clickCount: prev.clickCount + 1,
        lastActivity: Date.now(),
      }));
    };

    // Rastrear mudanças de página
    const handleRouteChange = () => {
      setSessionData(prev => ({
        ...prev,
        pageViews: prev.pageViews + 1,
      }));
    };

    // Configurar listeners
    timeInterval = setInterval(updateTimeOnPage, 1000);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    };
  }, [router]);

  // Enviar dados analytics
  const sendAnalytics = useCallback((event: string, data?: any) => {
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', event, {
          custom_parameter: data,
          session_duration: sessionData.timeOnPage,
          scroll_depth: sessionData.scrollDepth,
          click_count: sessionData.clickCount,
        });
      }

      // Analytics customizado
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          data,
          sessionData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch(() => {}); // Falha silenciosa
    }
  }, [sessionData]);

  return {
    sessionData,
    sendAnalytics,
  };
}

// Hook para otimização de recursos
export function useResourceOptimization() {
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [criticalResourcesLoaded, setCriticalResourcesLoaded] = useState(false);
  const [loadingStrategy, setLoadingStrategy] = useState<'immediate' | 'lazy' | 'preload'>('lazy');

  useEffect(() => {
    // Detectar capacidade do dispositivo
    const detectDeviceCapability = () => {
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as any).deviceMemory || 4;
      const connection = (navigator as any).connection;

      let strategy: 'immediate' | 'lazy' | 'preload' = 'lazy';

      // Dispositivos potentes: carregamento imediato
      if (cores >= 8 && memory >= 8) {
        strategy = 'immediate';
      }
      // Dispositivos médios: preload inteligente
      else if (cores >= 4 && memory >= 4) {
        strategy = 'preload';
      }
      // Dispositivos limitados: lazy loading
      else {
        strategy = 'lazy';
      }

      // Ajustar baseado na conexão
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (['slow-2g', '2g'].includes(effectiveType)) {
          strategy = 'lazy';
        } else if (effectiveType === '4g' && strategy === 'lazy') {
          strategy = 'preload';
        }
      }

      setLoadingStrategy(strategy);
    };

    detectDeviceCapability();

    // Precarregar recursos críticos
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/images/profile.jpg',
        '/images/hero-bg.jpg',
      ];

      const criticalFonts = [
        '/fonts/inter-var.woff2',
      ];

      const preloadPromises = [
        ...criticalImages.map(src => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
          });
        }),
        ...criticalFonts.map(href => {
          return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = href;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
          });
        }),
      ];

      Promise.allSettled(preloadPromises).then(() => {
        setCriticalResourcesLoaded(true);
      });
    };

    // Carregar recursos não-críticos
    const loadNonCriticalResources = () => {
      // Aguardar um tempo antes de carregar recursos não-críticos
      setTimeout(() => {
        setResourcesLoaded(true);
      }, loadingStrategy === 'immediate' ? 0 : 2000);
    };

    if (loadingStrategy !== 'lazy') {
      preloadCriticalResources();
    }

    loadNonCriticalResources();
  }, [loadingStrategy]);

  const preloadResource = useCallback((url: string, type: 'image' | 'script' | 'style' = 'image') => {
    if (loadingStrategy === 'lazy') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (type === 'image') {
      link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
  }, [loadingStrategy]);

  return {
    resourcesLoaded,
    criticalResourcesLoaded,
    loadingStrategy,
    preloadResource,
  };
}

// Hook para PWA avançado
export function useAdvancedPWA() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    // Verificar se está instalado
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = (navigator as any).standalone;
      setIsInstalled(isStandalone || isIOS);
    };

    // Listener para prompt de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setInstallable(true);
    };

    // Listener para instalação
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setInstallable(false);
    };

    // Listeners para status online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Configurar listeners
    checkInstallStatus();
    setIsOnline(navigator.onLine);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker para atualizações
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setInstallPrompt(null);
        setInstallable(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      return false;
    }
  }, [installPrompt]);

  const shareContent = useCallback(async (data: { title: string; text: string; url: string }) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        return false;
      }
    }
    
    // Fallback: copiar para clipboard
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(data.url);
        return true;
      } catch (error) {
        console.error('Erro ao copiar:', error);
        return false;
      }
    }
    
    return false;
  }, []);

  return {
    isInstalled,
    installable,
    updateAvailable,
    isOnline,
    promptInstall,
    shareContent,
  };
}

// Hook para acessibilidade avançada
export function useAccessibility() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => {
    // Detectar preferências de acessibilidade
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    setReducedMotion(motionQuery.matches);
    setHighContrast(contrastQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    // Detectar navegação por teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setFocusVisible(true);
      }
    };

    const handleMouseDown = () => {
      setFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // Aplicar configurações ao DOM
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
    document.documentElement.classList.toggle('high-contrast', highContrast);
    document.documentElement.classList.toggle('focus-visible', focusVisible);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [reducedMotion, highContrast, focusVisible]);

  const changeFontSize = useCallback((size: 'small' | 'normal' | 'large') => {
    setFontSize(size);
    document.documentElement.className = document.documentElement.className.replace(/font-size-\w+/, '');
    document.documentElement.classList.add(`font-size-${size}`);
    localStorage.setItem('accessibility-font-size', size);
  }, []);

  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return {
    reducedMotion,
    highContrast,
    fontSize,
    focusVisible,
    changeFontSize,
    announceToScreenReader,
  };
}

// Hook para SEO dinâmico
export function useDynamicSEO() {
  const router = useRouter();

  const updateSEO = useCallback((seoData: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
    noindex?: boolean;
  }) => {
    const {
      title,
      description,
      keywords,
      ogImage,
      canonical,
      noindex = false,
    } = seoData;

    // Atualizar title
    if (title) {
      document.title = title;
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
      
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute('content', title);
    }

    // Atualizar description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
      
      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute('content', description);
    }

    // Atualizar keywords
    if (keywords && keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // Atualizar OG image
    if (ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', ogImage);
      
      const twitterImg = document.querySelector('meta[name="twitter:image"]');
      if (twitterImg) twitterImg.setAttribute('content', ogImage);
    }

    // Atualizar canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // Atualizar robots
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');

    // Atualizar URL atual
    const currentUrl = window.location.href;
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', currentUrl);
  }, []);

  // Gerar structured data
  const addStructuredData = useCallback((data: any) => {
    // Remover structured data anterior
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Adicionar novo structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }, []);

  return {
    updateSEO,
    addStructuredData,
  };
}