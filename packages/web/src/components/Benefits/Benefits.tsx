'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { Benefit } from './Benefit';
import './Benefits.css';

const analyticsIllustration = '/components/FeaturesAndBenefits/illustrations/undraw_analytics-setup_ptrz.svg';
const eatingTogetherIllustration = '/components/FeaturesAndBenefits/illustrations/undraw_eating-together_mr7m.svg';
const halloweenIcon = '/components/FeaturesAndBenefits/illustrations/undraw_halloween-2025_o47f.svg';
const mindfulnessIllustration = '/components/FeaturesAndBenefits/illustrations/undraw_mindfulness_d853.svg';

export function Benefits() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="benefits" className="benefits-section">
      <Benefit
        illustrationSrc={analyticsIllustration}
        illustrationAlt="Analytics Setup"
        headline={t.featuresAndBenefits.benefits.benefit1.headline}
        paragraph={t.featuresAndBenefits.benefits.benefit1.paragraph}
        bullets={[
          t.featuresAndBenefits.benefits.benefit1.bullet1,
          t.featuresAndBenefits.benefits.benefit1.bullet2,
          t.featuresAndBenefits.benefits.benefit1.bullet3,
          t.featuresAndBenefits.benefits.benefit1.bullet4,
        ]}
        imagePosition="right"
        isLoading={isLoading}
      />
      <Benefit
        illustrationSrc={eatingTogetherIllustration}
        illustrationAlt="Eating Together"
        headline={t.featuresAndBenefits.benefits.benefit2.headline}
        paragraph={t.featuresAndBenefits.benefits.benefit2.paragraph}
        bullets={[
          t.featuresAndBenefits.benefits.benefit2.bullet1,
          t.featuresAndBenefits.benefits.benefit2.bullet2,
          t.featuresAndBenefits.benefits.benefit2.bullet3,
          t.featuresAndBenefits.benefits.benefit2.bullet4,
        ]}
        imagePosition="left"
        isLoading={isLoading}
      />
      <Benefit
        illustrationSrc={halloweenIcon}
        illustrationAlt="Halloween"
        headline={t.featuresAndBenefits.benefits.benefit3.headline}
        paragraph={t.featuresAndBenefits.benefits.benefit3.paragraph}
        bullets={[
          t.featuresAndBenefits.benefits.benefit3.bullet1,
          t.featuresAndBenefits.benefits.benefit3.bullet2,
          t.featuresAndBenefits.benefits.benefit3.bullet3,
        ]}
        imagePosition="right"
        isLoading={isLoading}
      />
      <Benefit
        illustrationSrc={mindfulnessIllustration}
        illustrationAlt="Mindfulness"
        headline={t.featuresAndBenefits.benefits.benefit4.headline}
        paragraph={t.featuresAndBenefits.benefits.benefit4.paragraph}
        bullets={[
          t.featuresAndBenefits.benefits.benefit4.bullet1,
          t.featuresAndBenefits.benefits.benefit4.bullet2,
          t.featuresAndBenefits.benefits.benefit4.bullet3,
          t.featuresAndBenefits.benefits.benefit4.bullet4,
        ]}
        imagePosition="left"
        isLoading={isLoading}
      />
    </section>
  );
}
