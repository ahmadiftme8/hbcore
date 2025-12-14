import Link from 'next/link';
import { GradientText } from '@/components/ui/gradient-text';
import type { TranslationSchema } from '@/i18n/types';
import { HeroSlideshow } from './HeroSlideshow';
import './Hero.css';

interface HeroProps {
  translations: TranslationSchema['hero'];
}

export function Hero({ translations }: HeroProps) {
  return (
    <section id="hero" className="hero">
      <div className="hero-background">
        <HeroSlideshow />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <GradientText text={translations.title} className="hero-title" />
        <p className="hero-subtitle">{translations.subtitle}</p>
        <div className="hero-ctas">
          <Link href="/events" className="hero-cta-primary">
            {translations.ctaPrimary}
          </Link>
          <div className="hero-cta-secondary">{translations.ctaSecondary}</div>
        </div>
      </div>
    </section>
  );
}
