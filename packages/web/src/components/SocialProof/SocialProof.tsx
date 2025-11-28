'use client';

import { TestimonialCarousel } from '@/components/TestimonialCarousel/TestimonialCarousel';
import { useTranslation } from '@/i18n/useTranslation';
import './SocialProof.css';

interface Testimonial {
  company: string;
  avatar: string;
  name: string;
  role: string;
  review: string;
}

export function SocialProof() {
  const { t } = useTranslation();

  // Sample testimonial data using existing images
  const testimonials: Testimonial[] = [
    {
      company: 'vercel',
      avatar: '/images/hero/hero_1.jpg',
      name: t.socialProof.testimonials.testimonial1.name,
      role: t.socialProof.testimonials.testimonial1.role,
      review: t.socialProof.testimonials.testimonial1.review,
    },
    {
      company: 'next',
      avatar: '/images/hero/hero_2.jpg',
      name: 'Sarah Johnson',
      role: 'Product Manager, Next.js',
      review: 'An amazing platform that brings teams together through innovative board games and strategic thinking.',
    },
    {
      company: 'globe',
      avatar: '/images/hero/hero_3.jpg',
      name: 'Michael Chen',
      role: 'Startup Founder',
      review: 'The networking opportunities and practical learning experience exceeded all my expectations.',
    },
    {
      company: 'file',
      avatar: '/images/hero/hero_4.jpg',
      name: 'Emily Rodriguez',
      role: 'Team Lead, Tech Corp',
      review: 'Perfect blend of fun and professional development. Our team building has never been this effective.',
    },
  ];

  return (
    <section id="social-proof" className="social-proof">
      <TestimonialCarousel testimonials={testimonials} companyLogoPath="" avatarPath="" />
    </section>
  );
}
