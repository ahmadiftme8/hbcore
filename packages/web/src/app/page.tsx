import { Suspense } from 'react';
import { Benefits } from '@/components/Benefits/Benefits';
import { Hero } from '@/components/Hero/Hero';
import { ShapeDivider } from '@/components/ShapeDivider/ShapeDivider';
import { getServerTranslations } from '@/i18n/server';

// import { Features } from '@/components/Features/Features';
// import { SocialProof } from '@/components/SocialProof/SocialProof';

export default async function Home() {
  const translations = await getServerTranslations();

  return (
    <>
      <Hero translations={translations.hero} />
      <ShapeDivider />
      {/* <Features translations={translations.features} /> */}
      <Suspense
        fallback={
          <section id="benefits" className="benefits-section">
            <div>Loading...</div>
          </section>
        }
      >
        <Benefits translations={translations.benefits} />
      </Suspense>
      {/* <SocialProof /> */}
    </>
  );
}
