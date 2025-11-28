import { Benefits } from '@/components/Benefits/Benefits';
import { Features } from '@/components/Features/Features';
import { Hero } from '@/components/Hero/Hero';
// import { SocialProof } from '@/components/SocialProof/SocialProof';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Benefits />
      {/* <SocialProof /> */}
    </>
  );
}
