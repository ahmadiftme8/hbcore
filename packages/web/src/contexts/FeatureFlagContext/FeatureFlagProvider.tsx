'use client';

import type { FeatureFlag } from '@hbcore/types';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '@/repositories/api-client';
import { FeatureFlagContext, type FeatureFlagContextType } from './FeatureFlagContext';

interface FeatureFlagProviderProps {
  children: ReactNode;
}

interface FeatureFlagResponse {
  enabled: boolean;
}

/**
 * Check if we're running in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  const [loading, setLoading] = useState(true);
  const flagCache = useRef<Map<FeatureFlag, boolean>>(new Map());

  useEffect(() => {
    // Mark as ready once mounted in browser
    if (isBrowser()) {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a feature flag status from the API
   */
  const fetchFlag = useCallback(async (flag: FeatureFlag): Promise<boolean> => {
    try {
      const response = await apiClient.get<FeatureFlagResponse>(`/feature-flags/${flag}`);
      const enabled = response.data.enabled;
      flagCache.current.set(flag, enabled);
      return enabled;
    } catch (error) {
      console.error(`Failed to fetch feature flag "${flag}":`, error);
      // Fail closed - return false on error
      return false;
    }
  }, []);

  /**
   * Check if a feature flag is enabled
   * Returns cached value if available, otherwise returns false
   * Use fetchFlag() to pre-fetch flags before checking
   */
  const isEnabled = useCallback(
    (flag: FeatureFlag): boolean => {
      const cached = flagCache.current.get(flag);
      if (cached !== undefined) {
        return cached;
      }

      // If not cached, trigger a fetch in background and return false for now
      void fetchFlag(flag);
      return false;
    },
    [fetchFlag],
  );

  const value: FeatureFlagContextType = {
    isEnabled,
    fetchFlag,
    loading,
  };

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
}
