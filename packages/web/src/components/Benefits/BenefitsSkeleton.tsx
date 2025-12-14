import { Benefit } from './Benefit';
import './Benefits.css';

export function BenefitsSkeleton() {
  return (
    <section id="benefits" className="benefits-section">
      <Benefit
        illustrationSrc=""
        illustrationAlt=""
        headline=""
        paragraph=""
        bullets={[]}
        imagePosition="right"
        isLoading={true}
      />
      <Benefit
        illustrationSrc=""
        illustrationAlt=""
        headline=""
        paragraph=""
        bullets={[]}
        imagePosition="left"
        isLoading={true}
      />
      <Benefit
        illustrationSrc=""
        illustrationAlt=""
        headline=""
        paragraph=""
        bullets={[]}
        imagePosition="right"
        isLoading={true}
      />
      <Benefit
        illustrationSrc=""
        illustrationAlt=""
        headline=""
        paragraph=""
        bullets={[]}
        imagePosition="left"
        isLoading={true}
      />
      <Benefit
        illustrationSrc=""
        illustrationAlt=""
        headline=""
        paragraph=""
        bullets={[]}
        imagePosition="right"
        isLoading={true}
      />
    </section>
  );
}

