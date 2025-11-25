import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation/Navigation';
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
    <html lang="en" dir="ltr" className="dark">
      <body className={`${rubik.variable} ${vazirmatn.variable} ${geistMono.variable} antialiased`}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
