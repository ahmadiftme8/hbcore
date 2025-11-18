/**
 * Translation Keys Constants
 *
 * Centralized constants for all translation keys used in the application.
 * This ensures type safety and prevents typos in translation key strings.
 */

export const TRANSLATION_KEYS = {
  common: {
    home: 'common.home',
    shop: 'common.shop',
    events: 'common.events',
    network: 'common.network',
    comingSoon: 'common.comingSoon',
    welcome: 'common.welcome',
    navigate: 'common.navigate',
    appName: 'common.appName',
  },
  home: {
    title: 'home.title',
    description: 'home.description',
    content: 'home.content',
  },
  events: {
    futureEvents: 'events.futureEvents',
    previousEvents: 'events.previousEvents',
    noFutureEvents: 'events.noFutureEvents',
    noPreviousEvents: 'events.noPreviousEvents',
  },
} as const;

/**
 * Type helper for translation keys
 */
export type TranslationKey =
  | (typeof TRANSLATION_KEYS.common)[keyof typeof TRANSLATION_KEYS.common]
  | (typeof TRANSLATION_KEYS.home)[keyof typeof TRANSLATION_KEYS.home]
  | (typeof TRANSLATION_KEYS.events)[keyof typeof TRANSLATION_KEYS.events];
