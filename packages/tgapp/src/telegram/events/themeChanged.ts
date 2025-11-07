/**
 * Theme Changed Event Handler
 * Handles theme changes from Telegram and applies them to the app
 */

import type { ThemeChangedPayload } from '../types';

/**
 * Applies theme based on Telegram's color scheme
 */
function applyThemeFromColorScheme(webApp: NonNullable<typeof window.Telegram>['WebApp']): void {
  const colorScheme = webApp.colorScheme;
  const isDark = colorScheme === 'dark';

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Sync background color with Telegram theme
  const themeParams = webApp.themeParams;
  if (themeParams?.bg_color) {
    webApp.setBackgroundColor(themeParams.bg_color);
  }
}

/**
 * Handler for theme_changed event
 * Updates the app's theme based on Telegram's theme parameters
 */
export function handleThemeChanged(
  _payload: ThemeChangedPayload,
  webApp: NonNullable<typeof window.Telegram>['WebApp'],
): void {
  console.log('[handleThemeChanged] Applying theme', {
    colorScheme: webApp.colorScheme,
    themeParams: webApp.themeParams,
  });
  // Apply theme based on color scheme
  applyThemeFromColorScheme(webApp);

  // You can also use the theme_params from the payload if needed
  // For example, to apply custom colors:
  // if (_payload.theme_params.bg_color) {
  //   webApp.setBackgroundColor(_payload.theme_params.bg_color);
  // }
}
