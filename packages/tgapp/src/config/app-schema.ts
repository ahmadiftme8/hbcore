/**
 * App Schema - Centralized definitions for pages, sections, and app metadata
 *
 * This file defines the structure of the application including:
 * - App metadata (name, description, etc.)
 * - Page routes and their translation keys
 * - Navigation sections
 */

export const APP_SCHEMA = {
  /**
   * App metadata
   */
  app: {
    name: 'common.appName',
  },

  /**
   * Page routes and their translation keys
   */
  pages: {
    home: {
      path: '/',
      translationKey: 'home',
    },
    shop: {
      path: '/shop',
      translationKey: 'common.shop',
    },
    events: {
      path: '/events',
      translationKey: 'common.events',
    },
    network: {
      path: '/network',
      translationKey: 'common.network',
    },
  },

  /**
   * Navigation sections
   */
  navigation: {
    bottom: {
      home: {
        path: '/',
        translationKey: 'common.home',
      },
      shop: {
        path: '/shop',
        translationKey: 'common.shop',
      },
      events: {
        path: '/events',
        translationKey: 'common.events',
      },
      network: {
        path: '/network',
        translationKey: 'common.network',
      },
      comingSoon: {
        translationKey: 'common.comingSoon',
      },
    },
  },
} as const;

/**
 * Type-safe accessors for app schema
 */
export type AppSchema = typeof APP_SCHEMA;
export type PageKey = keyof typeof APP_SCHEMA.pages;
export type NavigationSectionKey = keyof typeof APP_SCHEMA.navigation;
