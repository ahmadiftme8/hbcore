/**
 * Hook to get text direction from Telegram user's language code
 * Defaults to RTL if user info is not available
 */
const RTL_LANGUAGE_CODES = ['fa', 'ar', 'he', 'ur', 'yi'];

export function useDirection() {
  const webApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;

  // Get user language code from Telegram
  const userLanguageCode = webApp?.initDataUnsafe?.user?.language_code;

  // Determine direction based on user's language code
  // - If user language is RTL → use RTL
  // - If user language is LTR → use LTR
  // - If no user info available → default to RTL
  const direction = userLanguageCode
    ? RTL_LANGUAGE_CODES.includes(userLanguageCode.toLowerCase())
      ? 'rtl'
      : 'ltr'
    : 'rtl'; // Default to RTL when user info is not available

  return {
    direction: direction as 'rtl' | 'ltr',
    isRTL: direction === 'rtl',
    isLTR: direction === 'ltr',
    userLanguageCode: userLanguageCode || null,
  };
}
