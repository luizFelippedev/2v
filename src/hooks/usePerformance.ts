// src/hooks/usePerformance.ts
import { useEffect, useState } from "react";

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          ttfb: navigation.responseStart - navigation.requestStart
        }));
      }

      // Web Vitals
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            }
            if (entry.entryType === 'first-input') {
              setMetrics(prev => ({ 
                ...prev, 
                fid: (entry as any).processingStart - entry.startTime 
              }));
            }
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              setMetrics(prev => ({ 
                ...prev, 
                cls: (prev.cls || 0) + (entry as any).value 
              }));
            }
          }
        });

        try {
          observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        } catch (e) {
          console.warn('Performance Observer não suportado:', e);
        }

        return () => observer.disconnect();
      }
    };

    measurePerformance();
  }, []);

  return metrics;
};