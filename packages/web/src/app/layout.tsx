import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ThemeProvider } from 'next-themes';
import { DesignTokensProvider } from '@/components/DesignTokensProvider/DesignTokensProvider';
import { Footer } from '@/components/Footer/Footer';
import { LanguageAttributes } from '@/components/LanguageAttributes/LanguageAttributes';
import { Navbar1 } from '@/components/Navigation/Navbar1';
import { AuthProvider } from '@/contexts/AuthContext/AuthProvider';
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
    icons: {
      icon: [
        { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicons/favicon.ico', sizes: 'any' },
      ],
      apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      other: [
        { rel: 'android-chrome-192x192', url: '/favicons/android-chrome-192x192.png' },
        { rel: 'android-chrome-512x512', url: '/favicons/android-chrome-512x512.png' },
      ],
    },
    manifest: '/favicons/site.webmanifest',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${rubik.variable} ${vazirmatn.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="hbcore-theme"
          disableTransitionOnChange={false}
        >
          <DesignTokensProvider />
          <AuthProvider>
            <TranslationProvider>
              <LanguageAttributes />
              <Navbar1 />
              <main>{children}</main>
              <Footer />
            </TranslationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
