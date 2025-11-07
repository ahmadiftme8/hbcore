/**
 * Hook to initialize and manage Telegram event handlers
 */

import { useEffect } from 'react';
import { telegramEventManager } from '../eventManager';
import { handleThemeChanged } from '../events';

/**
 * Hook to set up Telegram event handlers
 * Should be called once at the app root level
 */
export function useTelegramEvents(): void {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (!webApp) {
      return;
    }

    // Initialize event manager (will only initialize once due to guard)
    telegramEventManager.initialize(webApp);

    // Register event handlers
    const unsubscribeTheme = telegramEventManager.on('theme_changed', (payload) => {
      console.log('[useTelegramEvents] Theme changed handler called', payload);
      handleThemeChanged(payload, webApp);
    });
    console.log('[useTelegramEvents] Event handlers registered');

    // Cleanup on unmount - only unsubscribe handlers, don't cleanup the entire manager
    return () => {
      unsubscribeTheme();
      // Don't call cleanup() here as it removes all event listeners
      // The event manager should persist as a singleton
    };
  }, []);
}
