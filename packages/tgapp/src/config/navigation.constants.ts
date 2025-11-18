import type { LucideIcon } from 'lucide-react';
import { Home, Lock, Network, Rocket, ShoppingBasket } from 'lucide-react';
import { TRANSLATION_KEYS } from './translation-keys.constants';

/**
 * Navigation item configuration
 */
export interface NavItemConfig {
  to?: string;
  translationKey: string;
  icon: LucideIcon;
  disabled?: boolean;
}

/**
 * Bottom navigation items configuration
 * Centralized constants for bottom navigation bar
 */
export const BOTTOM_NAV_ITEMS: NavItemConfig[] = [
  {
    to: '/',
    translationKey: TRANSLATION_KEYS.common.home,
    icon: Home,
  },
  {
    to: '/shop',
    translationKey: TRANSLATION_KEYS.common.shop,
    icon: ShoppingBasket,
  },
  {
    to: '/events',
    translationKey: TRANSLATION_KEYS.common.events,
    icon: Rocket,
  },
  {
    to: '/network',
    translationKey: TRANSLATION_KEYS.common.network,
    icon: Network,
  },
  {
    translationKey: TRANSLATION_KEYS.common.comingSoon,
    icon: Lock,
    disabled: true,
  },
] as const;
