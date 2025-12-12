import { useCallback, useEffect, useRef, useState } from 'react';
import { getTurnstileSiteKey, initTurnstile, removeTurnstile, resetTurnstile } from '../lib/turnstile/turnstile';
import { logger } from '../lib/utils/logger';

interface UseTurnstileOptions {
  enabled?: boolean;
  onError?: (error: string) => void;
  siteKeyNotConfiguredError?: string;
  verificationFailedError?: string;
  failedToLoadError?: string;
}

interface UseTurnstileReturn {
  token: string | null;
  error: string | null;
  isLoading: boolean;
  reset: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for managing Cloudflare Turnstile widget
 */
export function useTurnstile(options: UseTurnstileOptions = {}): UseTurnstileReturn {
  const {
    enabled = true,
    onError,
    siteKeyNotConfiguredError = 'Turnstile site key not configured',
    verificationFailedError = 'Turnstile verification failed',
    failedToLoadError = 'Failed to load security verification',
  } = options;

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);

  const setErrorState = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      onError?.(errorMessage);
    },
    [onError],
  );

  useEffect(() => {
    // Clean up when disabled
    if (!enabled) {
      if (widgetIdRef.current) {
        removeTurnstile(widgetIdRef.current);
        widgetIdRef.current = null;
        initializingRef.current = false;
        setToken(null);
        setError(null);
      }
      return;
    }

    // Don't initialize if container doesn't exist, already initialized, or currently initializing
    if (!containerRef.current || widgetIdRef.current || initializingRef.current) {
      return;
    }

    const siteKey = getTurnstileSiteKey();
    if (!siteKey) {
      setErrorState(siteKeyNotConfiguredError);
      return;
    }

    initializingRef.current = true;
    setIsLoading(true);
    setError(null);
    const container = containerRef.current;

    initTurnstile(
      container,
      siteKey,
      (newToken) => {
        setToken(newToken);
        setError(null);
        setIsLoading(false);
      },
      () => {
        setErrorState(verificationFailedError);
        setToken(null);
        setIsLoading(false);
      },
      () => {
        setToken(null);
      },
    )
      .then((id) => {
        widgetIdRef.current = id;
        initializingRef.current = false;
        setIsLoading(false);
      })
      .catch((err) => {
        initializingRef.current = false;
        setIsLoading(false);
        logger.error('Failed to initialize Turnstile:', err);
        setErrorState(failedToLoadError);
      });

    return () => {
      if (widgetIdRef.current) {
        removeTurnstile(widgetIdRef.current);
        widgetIdRef.current = null;
        initializingRef.current = false;
      }
    };
  }, [enabled, siteKeyNotConfiguredError, verificationFailedError, failedToLoadError, setErrorState]);

  const reset = () => {
    if (widgetIdRef.current) {
      resetTurnstile(widgetIdRef.current);
      setToken(null);
      setError(null);
    }
  };

  return {
    token,
    error,
    isLoading,
    reset,
    containerRef,
  };
}
