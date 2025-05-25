import { useState, useEffect } from "react";

/**
 * Hook para debouncing de valores de estado.
 * @param value Valor a ser debounced
 * @param delay Delay em ms
 */
export function useDebouncedState<T>(value: T, delay: number = 300): [T] {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return [debouncedValue];
}
