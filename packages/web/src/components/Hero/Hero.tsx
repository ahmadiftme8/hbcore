import Image from 'next/image';
import Link from 'next/link';
import { GradientText } from '@/components/ui/gradient-text';
import type { TranslationSchema } from '@/i18n/types';
import './Hero.css';

interface HeroProps {
  imagePath?: string;
  translations: TranslationSchema['hero'];
}

export function Hero({ imagePath = '/images/hero/hero_1.jpg', translations }: HeroProps) {
  return (
    <section id="hero" className="hero">
      <div className="hero-background">
        <Image src={imagePath} alt="Hero background" fill priority className="hero-image" sizes="100vw" quality={85} />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <GradientText text={translations.title} className="hero-title" />
        <p className="hero-subtitle">{translations.subtitle}</p>
        <div className="hero-ctas">
          <Link href="#" className="hero-cta-primary">
            {translations.ctaPrimary}
          </Link>
          <div className="hero-cta-secondary">{translations.ctaSecondary}</div>
        </div>
      </div>
    </section>
  );
}
