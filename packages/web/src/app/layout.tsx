import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { DesignTokensProvider } from '@/components/DesignTokensProvider/DesignTokensProvider';
import { Footer } from '@/components/Footer/Footer';
import { LanguageAttributes } from '@/components/LanguageAttributes/LanguageAttributes';
import { Navbar1 } from '@/components/Navigation/Navbar1';
import enTranslations from '@/i18n/locales/en.json';
import faTranslations from '@/i18n/locales/fa.json';
import type { Language } from '@/i18n/TranslationProvider';
import { TranslationProvider } from '@/i18n/TranslationProvider';
import { geistMono, rubik, vazirmatn } from '@/lib/fonts';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = (cookieStore.get('hbcore-language')?.value || 'fa') as Language;
  const translations = language === 'en' ? enTranslations : faTranslations;

  return {
    title: translations.metadata.title,
    description: translations.metadata.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className={`${rubik.variable} ${vazirmatn.variable} ${geistMono.variable} antialiased`}>
        <DesignTokensProvider />
        <TranslationProvider>
          <LanguageAttributes />
          <Navbar1 />
          <main>{children}</main>
          <Footer />
        </TranslationProvider>
      </body>
    </html>
  );
}
