'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/i18n/useTranslation';
import './Hero.css';

interface HeroProps {
  imagePath?: string;
}

export function Hero({ imagePath = '/images/hero/hero_1.jpg' }: HeroProps) {
  const { t } = useTranslation();

  return (
    <section id="hero" className="hero">
      <div className="hero-background">
        <Image src={imagePath} alt="Hero background" fill priority className="hero-image" sizes="100vw" quality={90} />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">{t.hero.title}</h1>
        <p className="hero-subtitle">{t.hero.subtitle}</p>
        <div className="hero-ctas">
          <Link href="#" className="hero-cta-primary">
            {t.hero.ctaPrimary}
          </Link>
          <div className="hero-cta-secondary">
            {t.hero.ctaSecondary}
          </div>
        </div>
      </div>
    </section>
  );
}
