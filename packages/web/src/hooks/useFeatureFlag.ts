'use client';

import type { FeatureFlag } from '@hbcore/types';
import { useContext, useEffect, useState } from 'react';
import { FeatureFlagContext } from '@/contexts/FeatureFlagContext/FeatureFlagContext';

/**
 * Hook to check if a feature flag is enabled
 * Fetches the flag status from API on mount
 * @param flag - The feature flag to check
 * @returns true if feature is enabled, false otherwise
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  const featureFlagContext = useContext(FeatureFlagContext);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!featureFlagContext) {
      return;
    }

    // Fetch the flag status
    void featureFlagContext.fetchFlag(flag).then(setEnabled);
  }, [flag, featureFlagContext]);

  if (!featureFlagContext) {
    console.warn('useFeatureFlag must be used within FeatureFlagProvider');
    return false;
  }

  return enabled;
}
