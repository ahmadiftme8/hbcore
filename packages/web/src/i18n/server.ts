import { cookies } from 'next/headers';
import enTranslations from './locales/en.json';
import faTranslations from './locales/fa.json';
import type { Language, TranslationSchema } from './types';

const COOKIE_KEY = 'hbcore-language';

/**
 * Translation resources for server-side use
 */
const translationResources: Record<Language, TranslationSchema> = {
  fa: faTranslations as TranslationSchema,
  en: enTranslations as TranslationSchema,
};

/**
 * Get the current language from cookies (server-side)
 * @returns The current language, defaults to 'fa' if not found
 */
export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const language = cookieStore.get(COOKIE_KEY)?.value;
  return (language === 'en' || language === 'fa' ? language : 'fa') as Language;
}

/**
 * Get translations for the current language (server-side)
 * @param language - Optional language override, otherwise reads from cookies
 * @returns The translations object for the specified or current language
 */
export async function getServerTranslations(language?: Language): Promise<TranslationSchema> {
  const lang = language || (await getServerLanguage());
  return translationResources[lang];
}

/**
 * Get a specific translation section (server-side)
 * @param section - The section key from TranslationSchema
 * @param language - Optional language override
 * @returns The translation section object
 */
export async function getServerTranslationSection<T extends keyof TranslationSchema>(
  section: T,
  language?: Language,
): Promise<TranslationSchema[T]> {
  const translations = await getServerTranslations(language);
  return translations[section];
}

