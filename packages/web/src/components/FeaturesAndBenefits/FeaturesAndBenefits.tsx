'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/i18n/useTranslation';
import './FeaturesAndBenefits.css';

// SVG Paths
const analyticsSetupIcon = '/components/FeaturesAndBenefits/illustrations/undraw_analytics-setup_ptrz.svg';
const mindfulnessIcon = '/components/FeaturesAndBenefits/illustrations/undraw_mindfulness_d853.svg';
const halloweenIcon = '/components/FeaturesAndBenefits/illustrations/undraw_halloween-2025_o47f.svg';
const eatingTogetherIllustration = '/components/FeaturesAndBenefits/illustrations/undraw_eating-together_mr7m.svg';

interface FeatureProps {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
  isLoading?: boolean;
}

function Feature({ iconSrc, iconAlt, title, description, isLoading = false }: FeatureProps) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        {isLoading ? (
          <Skeleton className="w-12 h-12 rounded-lg" />
        ) : (
          <Image src={iconSrc} alt={iconAlt} width={48} height={48} className="feature-icon-image" />
        )}
      </div>
      <h3 className="feature-title">{isLoading ? <Skeleton className="h-6 w-32 mb-2" /> : title}</h3>
      <p className="feature-description">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </>
        ) : (
          description
        )}
      </p>
    </div>
  );
}

interface BenefitProps {
  illustrationSrc: string;
  illustrationAlt: string;
  headline: string;
  paragraph: string;
  bullets: string[];
  imagePosition: 'left' | 'right';
  isLoading?: boolean;
}

function Benefit({
  illustrationSrc,
  illustrationAlt,
  headline,
  paragraph,
  bullets,
  imagePosition,
  isLoading = false,
}: BenefitProps) {
  return (
    <div className={`benefit-card benefit-${imagePosition}`}>
      <div className="benefit-illustration">
        {isLoading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <Image
            src={illustrationSrc}
            alt={illustrationAlt}
            width={400}
            height={400}
            className="benefit-illustration-image"
          />
        )}
      </div>
      <div className="benefit-content">
        <h2 className="benefit-headline">{isLoading ? <Skeleton className="h-8 w-full mb-4" /> : headline}</h2>
        <p className="benefit-paragraph">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </>
          ) : (
            paragraph
          )}
        </p>
        <ul className="benefit-bullets">
          {isLoading ? (
            <>
              <li>
                <Skeleton className="h-5 w-full mb-2" />
              </li>
              <li>
                <Skeleton className="h-5 w-full mb-2" />
              </li>
              <li>
                <Skeleton className="h-5 w-3/4" />
              </li>
            </>
          ) : (
            bullets.map((bullet) => (
              <li key={bullet} className="benefit-bullet">
                {bullet}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export function FeaturesAndBenefits() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="features-and-benefits">
      <div className="features-section">
        <div className="features-grid">
          <Feature
            iconSrc={analyticsSetupIcon}
            iconAlt="Analytics Setup"
            title={t('featuresAndBenefits.features.feature1.title')}
            description={t('featuresAndBenefits.features.feature1.description')}
            isLoading={isLoading}
          />
          <Feature
            iconSrc={mindfulnessIcon}
            iconAlt="Mindfulness"
            title={t('featuresAndBenefits.features.feature2.title')}
            description={t('featuresAndBenefits.features.feature2.description')}
            isLoading={isLoading}
          />
          <Feature
            iconSrc={halloweenIcon}
            iconAlt="Halloween"
            title={t('featuresAndBenefits.features.feature3.title')}
            description={t('featuresAndBenefits.features.feature3.description')}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="benefits-section">
        <Benefit
          illustrationSrc={eatingTogetherIllustration}
          illustrationAlt="Eating Together"
          headline={t('featuresAndBenefits.benefits.benefit1.headline')}
          paragraph={t('featuresAndBenefits.benefits.benefit1.paragraph')}
          bullets={[
            t('featuresAndBenefits.benefits.benefit1.bullet1'),
            t('featuresAndBenefits.benefits.benefit1.bullet2'),
            t('featuresAndBenefits.benefits.benefit1.bullet3'),
            t('featuresAndBenefits.benefits.benefit1.bullet4'),
          ]}
          imagePosition="right"
          isLoading={isLoading}
        />
        <Benefit
          illustrationSrc={halloweenIcon}
          illustrationAlt="Halloween"
          headline={t('featuresAndBenefits.benefits.benefit2.headline')}
          paragraph={t('featuresAndBenefits.benefits.benefit2.paragraph')}
          bullets={[
            t('featuresAndBenefits.benefits.benefit2.bullet1'),
            t('featuresAndBenefits.benefits.benefit2.bullet2'),
            t('featuresAndBenefits.benefits.benefit2.bullet3'),
          ]}
          imagePosition="left"
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
