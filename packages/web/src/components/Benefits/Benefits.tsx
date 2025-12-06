import type { TranslationSchema } from '@/i18n/types';
import { Benefit } from './Benefit';
import './Benefits.css';

const analyticsIllustration = '/components/FeaturesAndBenefits/illustrations/undraw_analytics-setup_ptrz.svg';
const mindfulnessIllustration = '/components/FeaturesAndBenefits/illustrations/undraw_mindfulness_d853.svg';
const halloweenIcon = '/components/FeaturesAndBenefits/illustrations/undraw_halloween-2025_o47f.svg';
const eatingTogetherIllustration = '/components/FeaturesAndBenefits/illustrations/undraw_eating-together_mr7m.svg';

interface BenefitsProps {
  translations: TranslationSchema['benefits'];
}

export function Benefits({ translations }: BenefitsProps) {
  return (
    <section id="benefits" className="benefits-section">
      <Benefit
        illustrationSrc={analyticsIllustration}
        illustrationAlt="Analytics Setup"
        headline={translations.benefit1.headline}
        paragraph={translations.benefit1.paragraph}
        bullets={[
          translations.benefit1.bullet1,
          translations.benefit1.bullet2,
          translations.benefit1.bullet3,
          translations.benefit1.bullet4,
        ]}
        imagePosition="right"
      />
      <Benefit
        illustrationSrc={mindfulnessIllustration}
        illustrationAlt="Mindfulness"
        headline={translations.benefit2.headline}
        paragraph={translations.benefit2.paragraph}
        bullets={[
          translations.benefit2.bullet1,
          translations.benefit2.bullet2,
          translations.benefit2.bullet3,
          translations.benefit2.bullet4,
        ]}
        imagePosition="left"
      />
      <Benefit
        illustrationSrc={halloweenIcon}
        illustrationAlt="Halloween"
        headline={translations.benefit3.headline}
        paragraph={translations.benefit3.paragraph}
        bullets={[
          translations.benefit3.bullet1,
          translations.benefit3.bullet2,
          translations.benefit3.bullet3,
          translations.benefit3.bullet4,
        ]}
        imagePosition="right"
      />
      <Benefit
        illustrationSrc={eatingTogetherIllustration}
        illustrationAlt="Eating Together"
        headline={translations.benefit4.headline}
        paragraph={translations.benefit4.paragraph}
        bullets={[
          translations.benefit4.bullet1,
          translations.benefit4.bullet2,
          translations.benefit4.bullet3,
          translations.benefit4.bullet4,
        ]}
        imagePosition="left"
      />
      <Benefit
        illustrationSrc={analyticsIllustration}
        illustrationAlt="Analytics Setup"
        headline={translations.benefit5.headline}
        paragraph={translations.benefit5.paragraph}
        bullets={[
          translations.benefit5.bullet1,
          translations.benefit5.bullet2,
          translations.benefit5.bullet3,
          translations.benefit5.bullet4,
        ]}
        imagePosition="right"
      />
    </section>
  );
}
