import type { TranslationSchema } from '@/i18n/types';
import { Feature } from './Feature';
import './Features.css';

const analyticsSetupIcon = '/vectors/undraw_analytics-setup_ptrz.svg';
const mindfulnessIcon = '/vectors/undraw_mindfulness_d853.svg';
const halloweenIcon = '/vectors/undraw_halloween-2025_o47f.svg';
const eatingTogetherIcon = '/vectors/undraw_eating-together_mr7m.svg';

interface FeaturesProps {
  translations: TranslationSchema['features'];
}

export function Features({ translations }: FeaturesProps) {
  return (
    <section id="features" className="features-section">
      <div className="features-grid">
        <Feature
          iconSrc={analyticsSetupIcon}
          iconAlt="Analytics Setup"
          title={translations.feature1.title}
          description={translations.feature1.description}
        />
        <Feature
          iconSrc={mindfulnessIcon}
          iconAlt="Mindfulness"
          title={translations.feature2.title}
          description={translations.feature2.description}
        />
        <Feature
          iconSrc={halloweenIcon}
          iconAlt="Halloween"
          title={translations.feature3.title}
          description={translations.feature3.description}
        />
        <Feature
          iconSrc={eatingTogetherIcon}
          iconAlt="Ideation Challenge"
          title={translations.feature4.title}
          description={translations.feature4.description}
        />
        <Feature
          iconSrc={analyticsSetupIcon}
          iconAlt="Cash Prizes"
          title={translations.feature5.title}
          description={translations.feature5.description}
        />
      </div>
    </section>
  );
}
