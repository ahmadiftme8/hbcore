import { useEffect } from 'react';

/**
 * Hook to apply dark mode theme
 * Currently always sets dark mode
 */
export function useTelegramTheme() {
  useEffect(() => {
    // Always set dark mode
    document.documentElement.classList.add('dark');

    // Check if running in Telegram
    const webApp = window.Telegram?.WebApp;

    if (webApp) {
      // Expand the app to full height
      webApp.expand();

      // Sync background color with Telegram theme if available
      const themeParams = webApp.themeParams;
      if (themeParams?.bg_color) {
        webApp.setBackgroundColor(themeParams.bg_color);
      }
    }
  }, []);
}
