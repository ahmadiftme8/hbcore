'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import './HeroSlideshow.css';

const HERO_IMAGES = Array.from({ length: 10 }, (_, i) => `/images/hero/hero_${i + 1}.jpg`);
const SLIDE_DURATION = 5000; // 5 seconds per slide
const FADE_DURATION = 2000; // 2 seconds fade transition

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slideshow">
      {HERO_IMAGES.map((src, index) => (
        <div
          key={src}
          className={`hero-slideshow__slide ${index === currentIndex ? 'is-active' : ''}`}
          style={{ '--fade-duration': `${FADE_DURATION}ms` } as React.CSSProperties}
        >
          <Image
            src={src}
            alt={`Hero background ${index + 1}`}
            fill
            priority={index === 0}
            className="hero-image"
            sizes="100vw"
            quality={85}
          />
        </div>
      ))}
    </div>
  );
}
