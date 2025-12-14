'use client';

import type { FeatureFlag } from '@hbcore/types';
import { useContext, useEffect, useState } from 'react';
import { FeatureFlagContext } from '@/contexts/FeatureFlagContext/FeatureFlagContext';

/**
 * Hook to check multiple feature flags at once
 * Fetches all flag statuses from API on mount
 * @param flags - Array of feature flags to check
 * @returns Record mapping each flag to its enabled state
 */
export function useFeatureFlags(flags: FeatureFlag[]): Record<FeatureFlag, boolean> {
  const featureFlagContext = useContext(FeatureFlagContext);
  const [flagStates, setFlagStates] = useState<Record<FeatureFlag, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const flag of flags) {
      initial[flag] = false;
    }
    return initial as Record<FeatureFlag, boolean>;
  });

  useEffect(() => {
    if (!featureFlagContext) {
      return;
    }

    // Fetch all flags in parallel
    const fetchAllFlags = async () => {
      const results = await Promise.all(
        flags.map(async (flag) => {
          const enabled = await featureFlagContext.fetchFlag(flag);
          return [flag, enabled] as const;
        }),
      );

      const newState: Record<string, boolean> = {};
      for (const [flag, enabled] of results) {
        newState[flag] = enabled;
      }
      setFlagStates(newState as Record<FeatureFlag, boolean>);
    };

    void fetchAllFlags();
  }, [flags, featureFlagContext]);

  if (!featureFlagContext) {
    console.warn('useFeatureFlags must be used within FeatureFlagProvider');
    const fallback: Record<string, boolean> = {};
    for (const flag of flags) {
      fallback[flag] = false;
    }
    return fallback as Record<FeatureFlag, boolean>;
  }

  return flagStates;
}
