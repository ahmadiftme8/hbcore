import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { useDirection } from '@/hooks/useDirection';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { Home } from '@/pages/Home';
import { Events } from '@/pages/Events';

export function App() {
  useTelegramTheme();
  const { i18n } = useTranslation();
  const { direction } = useDirection();

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', i18n.language);
  }, [direction, i18n.language]);

  return (
    <BrowserRouter basename="/tgapp">
      <Layout>
        <main className="min-h-[calc(100vh-4rem)] pt-12 pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
          </Routes>
        </main>
      </Layout>
    </BrowserRouter>
  );
}
