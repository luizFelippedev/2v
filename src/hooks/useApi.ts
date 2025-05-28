// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from "react";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Hook genérico para requisições de API
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await apiFunction(...args);
        setState({ data, loading: false, error: null });
        
        if (options.onSuccess) {
          options.onSuccess(data);
        }
        
        return data;
      } catch (error: any) {
        const errorMessage = error.message || "Erro desconhecido";
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        
        if (options.onError) {
          options.onError(errorMessage);
        }
        
        throw error;
      }
    },
    [apiFunction, options]
  );

  // Executar imediatamente se solicitado
  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook específico para lista paginada
export function usePaginatedApi<T>(
  apiFunction: (params: any) => Promise<{ data: T[]; pagination: any }>,
  initialParams: any = {}
) {
  const [params, setParams] = useState(initialParams);
  const [allData, setAllData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const {
    data: response,
    loading,
    error,
    execute,
  } = useApi(apiFunction);

  useEffect(() => {
    if (response) {
      if (params.page === 1) {
        setAllData(response.data);
      } else {
        setAllData((prev) => [...prev, ...response.data]);
      }
      setPagination(response.pagination);
    }
  }, [response, params.page]);

  const loadMore = useCallback(() => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      setParams((prev) => ({ ...prev, page: prev.page + 1 }));
      execute({ ...params, page: params.page + 1 });
    }
  }, [pagination, params, execute]);

  const refresh = useCallback(() => {
    setParams((prev) => ({ ...prev, page: 1 }));
    setAllData([]);
    execute({ ...params, page: 1 });
  }, [params, execute]);

  const updateParams = useCallback((newParams: any) => {
    const updatedParams = { ...params, ...newParams, page: 1 };
    setParams(updatedParams);
    setAllData([]);
    execute(updatedParams);
  }, [params, execute]);

  // Executar na montagem
  useEffect(() => {
    execute(params);
  }, []);

  return {
    data: allData,
    pagination,
    loading,
    error,
    loadMore,
    refresh,
    updateParams,
    hasMore: pagination ? pagination.currentPage < pagination.totalPages : false,
  };
}

// Hook para cache simples
export function useApiCache<T>(
  key: string,
  apiFunction: () => Promise<T>,
  options: { ttl?: number; immediate?: boolean } = {}
) {
  const { ttl = 5 * 60 * 1000, immediate = true } = options; // 5 minutos padrão
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getCacheKey = (key: string) => `api_cache_${key}`;
  const getTimestampKey = (key: string) => `api_cache_${key}_timestamp`;

  const isDataFresh = useCallback(() => {
    if (typeof window === "undefined") return false;
    
    const timestamp = localStorage.getItem(getTimestampKey(key));
    if (!timestamp) return false;
    
    const now = Date.now();
    const dataTime = parseInt(timestamp);
    return (now - dataTime) < ttl;
  }, [key, ttl]);

  const getCachedData = useCallback(() => {
    if (typeof window === "undefined") return null;
    
    try {
      const cached = localStorage.getItem(getCacheKey(key));
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }, [key]);

  const setCachedData = useCallback((data: T) => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(getCacheKey(key), JSON.stringify(data));
      localStorage.setItem(getTimestampKey(key), Date.now().toString());
    } catch (error) {
      console.warn("Failed to cache data:", error);
    }
  }, [key]);

  const execute = useCallback(async (forceRefresh = false) => {
    // Verificar cache primeiro
    if (!forceRefresh && isDataFresh()) {
      const cachedData = getCachedData();
      if (cachedData) {
        setState({ data: cachedData, loading: false, error: null });
        return cachedData;
      }
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiFunction();
      setState({ data, loading: false, error: null });
      setCachedData(data);
      return data;
    } catch (error: any) {
      const errorMessage = error.message || "Erro desconhecido";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [apiFunction, isDataFresh, getCachedData, setCachedData]);

  const invalidateCache = useCallback(() => {
    if (typeof window === "undefined") return;
    
    localStorage.removeItem(getCacheKey(key));
    localStorage.removeItem(getTimestampKey(key));
  }, [key]);

  // Executar na montagem se solicitado
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    invalidateCache,
    refresh: () => execute(true),
  };
}

// Hook para requisições em tempo real (polling)
export function useRealtimeApi<T>(
  apiFunction: () => Promise<T>,
  interval: number = 30000 // 30 segundos padrão
) {
  const { data, loading, error, execute } = useApi(apiFunction, { immediate: true });
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPolling) {
      intervalId = setInterval(() => {
        execute();
      }, interval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPolling, interval, execute]);

  const startPolling = useCallback(() => setIsPolling(true), []);
  const stopPolling = useCallback(() => setIsPolling(false), []);

  return {
    data,
    loading,
    error,
    isPolling,
    startPolling,
    stopPolling,
    refresh: execute,
  };
}