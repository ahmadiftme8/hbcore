'use client';

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import enTranslations from './locales/en.json';
import faTranslations from './locales/fa.json';
import type { TranslationSchema } from './types';

export type Language = 'fa' | 'en';

type Translations = TranslationSchema;

interface TranslationContextType {
  language: Language;
  translations: Translations;
  changeLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const STORAGE_KEY = 'hbcore-language';
const COOKIE_KEY = 'hbcore-language';

// Type assertion to ensure JSON files match the schema
const translationResources: Record<Language, Translations> = {
  fa: faTranslations as Translations,
  en: enTranslations as Translations,
};

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  // Always start with default language to prevent hydration mismatch
  // Server and client must render the same initial state
  const [language, setLanguage] = useState<Language>('fa');

  useEffect(() => {
    // After hydration, check for saved language or default to Persian
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'fa' || saved === 'en') {
      setLanguage(saved);
      // Sync to cookie for server-side access
      document.cookie = `${COOKIE_KEY}=${saved}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      // Default to Persian without browser detection
      setLanguage('fa');
      localStorage.setItem(STORAGE_KEY, 'fa');
      document.cookie = `${COOKIE_KEY}=fa; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    // Sync to cookie for server-side access
    document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const value: TranslationContextType = {
    language,
    translations: translationResources[language],
    changeLanguage,
  };

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
}
