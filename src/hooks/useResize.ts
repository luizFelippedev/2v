import { useState, useEffect, useCallback } from 'react';

interface ResizeConfig {
  debounceMs?: number;
  breakpoints?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
}

export function useResize(config: ResizeConfig = {}) {
  const {
    debounceMs = 250,
    breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  } = config;

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    breakpoint: '',
  });

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setDimensions({
      width,
      height,
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
      breakpoint: width < breakpoints.sm ? 'xs'
        : width < breakpoints.md ? 'sm'
        : width < breakpoints.lg ? 'md'
        : width < breakpoints.xl ? 'lg'
        : width < breakpoints['2xl'] ? 'xl'
        : '2xl',
    });
  }, [breakpoints]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, debounceMs);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', debouncedResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', debouncedResize);
        clearTimeout(timeoutId);
      };
    }
  }, [handleResize, debounceMs]);

  return dimensions;
}
