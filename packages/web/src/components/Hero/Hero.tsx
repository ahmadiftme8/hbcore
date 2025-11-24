'use client';

import Image from 'next/image';
import './Hero.css';

interface HeroProps {
  imagePath?: string;
  title?: string;
  subtitle?: string;
}

export function Hero({
  imagePath = '/images/hero/hero_1.jpg',
  title = 'به زودی',
  subtitle = 'ما در حال آماده‌سازی چیزی فوق‌العاده هستیم',
}: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-background">
        <Image src={imagePath} alt="Hero background" fill priority className="hero-image" sizes="100vw" quality={90} />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </div>
    </section>
  );
}
