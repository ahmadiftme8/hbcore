import { Geist_Mono, Rubik, Vazirmatn } from 'next/font/google';

/**
 * Font configurations for the application
 * These fonts are loaded from Google Fonts and configured with CSS variables
 */

export const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['latin', 'arabic'],
  display: 'swap',
});

export const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['latin', 'arabic'],
  display: 'swap',
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});
