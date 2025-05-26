import { useState, useEffect, useCallback, RefObject } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

export function useInfiniteScroll<T extends Element>(
  targetRef: RefObject<T>,
  onIntersect: () => Promise<void> | void,
  options: UseInfiniteScrollOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleObserver = useCallback(async (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    
    if (target.isIntersecting && !isLoading) {
      setIsLoading(true);
      setError(null);
      
      try {
        await onIntersect();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    }
  }, [onIntersect, isLoading]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? '0px',
      threshold: options.threshold ?? 0.1,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [targetRef, handleObserver, options]);

  return { isLoading, error };
}
