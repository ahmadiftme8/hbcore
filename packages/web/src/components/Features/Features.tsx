'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { Feature } from './Feature';
import './Features.css';

const analyticsSetupIcon = '/components/FeaturesAndBenefits/illustrations/undraw_analytics-setup_ptrz.svg';
const mindfulnessIcon = '/components/FeaturesAndBenefits/illustrations/undraw_mindfulness_d853.svg';
const halloweenIcon = '/components/FeaturesAndBenefits/illustrations/undraw_halloween-2025_o47f.svg';
const eatingTogetherIcon = '/components/FeaturesAndBenefits/illustrations/undraw_eating-together_mr7m.svg';

export function Features() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="features" className="features-section">
      <div className="features-grid">
        <Feature
          iconSrc={analyticsSetupIcon}
          iconAlt="Analytics Setup"
          title={t.features.feature1.title}
          description={t.features.feature1.description}
          isLoading={isLoading}
        />
        <Feature
          iconSrc={mindfulnessIcon}
          iconAlt="Mindfulness"
          title={t.features.feature2.title}
          description={t.features.feature2.description}
          isLoading={isLoading}
        />
        <Feature
          iconSrc={halloweenIcon}
          iconAlt="Halloween"
          title={t.features.feature3.title}
          description={t.features.feature3.description}
          isLoading={isLoading}
        />
        <Feature
          iconSrc={eatingTogetherIcon}
          iconAlt="Ideation Challenge"
          title={t.features.feature4.title}
          description={t.features.feature4.description}
          isLoading={isLoading}
        />
        <Feature
          iconSrc={analyticsSetupIcon}
          iconAlt="Cash Prizes"
          title={t.features.feature5.title}
          description={t.features.feature5.description}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
