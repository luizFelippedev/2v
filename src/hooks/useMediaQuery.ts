import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      const updateMatch = (e: MediaQueryListEvent | MediaQueryList) => {
        setMatches(e.matches);
      };

      setMatches(media.matches);
      media.addListener(updateMatch);

      return () => media.removeListener(updateMatch);
    }
  }, [query]);

  return matches;
}
