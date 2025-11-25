import type { Metadata } from 'next';
import { LanguageAttributes } from '@/components/LanguageAttributes/LanguageAttributes';
import { Navigation } from '@/components/Navigation/Navigation';
import { TranslationProvider } from '@/i18n/TranslationProvider';
import { DesignTokensProvider } from '@/components/DesignTokensProvider/DesignTokensProvider';
import { geistMono, rubik, vazirmatn } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Data to enrich your online business',
  description: 'Data to enrich your online business',
};

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
          <Navigation />
          <main>{children}</main>
        </TranslationProvider>
      </body>
    </html>
  );
}
