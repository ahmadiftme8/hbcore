/**
 * Cloudflare Turnstile integration
 * Loads the Turnstile script and provides utilities for widget management
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
    };
  }
}

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
let scriptLoaded = false;
let scriptLoading = false;

/**
 * Load Turnstile script dynamically
 */
async function loadTurnstileScript(): Promise<void> {
  if (scriptLoaded || typeof window === 'undefined') {
    return;
  }

  if (scriptLoading) {
    // Wait for existing load to complete
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (scriptLoaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  scriptLoading = true;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
    };

    script.onerror = () => {
      scriptLoading = false;
      reject(new Error('Failed to load Turnstile script'));
    };

    document.head.appendChild(script);
  });
}

/**
 * Initialize Turnstile widget
 * @param container - ID string or HTMLElement of the container
 * @param siteKey - Turnstile site key
 * @param onSuccess - Callback when token is generated
 * @param onError - Callback when error occurs
 * @param onExpired - Callback when token expires
 * @returns Widget ID
 */
export async function initTurnstile(
  container: string | HTMLElement,
  siteKey: string,
  onSuccess?: (token: string) => void,
  onError?: () => void,
  onExpired?: () => void,
): Promise<string> {
  await loadTurnstileScript();

  if (!window.turnstile) {
    throw new Error('Turnstile script not loaded');
  }

  const widgetId = window.turnstile.render(container, {
    sitekey: siteKey,
    callback: onSuccess,
    'error-callback': onError,
    'expired-callback': onExpired,
  });

  return widgetId;
}

/**
 * Reset Turnstile widget
 * @param widgetId - Widget ID to reset
 */
export function resetTurnstile(widgetId?: string): void {
  if (window.turnstile) {
    window.turnstile.reset(widgetId);
  }
}

/**
 * Remove Turnstile widget
 * @param widgetId - Widget ID to remove
 */
export function removeTurnstile(widgetId?: string): void {
  if (window.turnstile) {
    window.turnstile.remove(widgetId);
  }
}

/**
 * Get Turnstile response token
 * @param widgetId - Widget ID
 * @returns Token string or undefined
 */
export function getTurnstileToken(widgetId?: string): string | undefined {
  if (window.turnstile) {
    return window.turnstile.getResponse(widgetId);
  }
  return undefined;
}

/**
 * Get Turnstile site key from environment
 */
export function getTurnstileSiteKey(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || '';
}
