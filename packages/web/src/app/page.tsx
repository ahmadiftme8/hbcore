import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Hero } from '@/components/Hero/Hero';
import { ShapeDivider } from '@/components/ShapeDivider/ShapeDivider';
import { getServerTranslations } from '@/i18n/server';

// import { Features } from '@/components/Features/Features';
// import { SocialProof } from '@/components/SocialProof/SocialProof';

// Lazy load Benefits component (below the fold)
const Benefits = dynamic(() => import('@/components/Benefits/Benefits').then((mod) => ({ default: mod.Benefits })), {
  loading: () => (
    <section id="benefits" className="benefits-section">
      <div>Loading...</div>
    </section>
  ),
});

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
