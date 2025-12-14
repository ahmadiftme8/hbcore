'use client';

import type { FeatureFlag } from '@hbcore/types';
import { createContext } from 'react';

export interface FeatureFlagContextType {
  /**
   * Check if a feature flag is enabled
   * Returns the cached value if available, or fetches from API
   */
  isEnabled: (flag: FeatureFlag) => boolean;
  /**
   * Fetch and cache a feature flag status from the API
   * Use this to pre-fetch flags or force refresh
   */
  fetchFlag: (flag: FeatureFlag) => Promise<boolean>;
  /**
   * Whether the feature flag client is still initializing
   */
  loading: boolean;
}

export const FeatureFlagContext = createContext<FeatureFlagContextType | null>(null);
