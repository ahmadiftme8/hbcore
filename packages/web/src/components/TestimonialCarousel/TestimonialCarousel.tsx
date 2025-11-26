'use client';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import * as React from 'react';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';
import './TestimonialCarousel.css';

interface Testimonial {
  company: string;
  avatar: string;
  name: string;
  role: string;
  review: string;
}

interface TestimonialCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  testimonials: Testimonial[];
  companyLogoPath?: string;
  avatarPath?: string;
}

export const TestimonialCarousel = React.forwardRef<HTMLDivElement, TestimonialCarouselProps>(
  ({ className, testimonials, companyLogoPath = '', avatarPath = '', ...props }, ref) => {
    const { isRTL } = useTranslation();
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    const autoplayPlugin = React.useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: true }), []);

    React.useEffect(() => {
      if (!api) return;

      api.on('select', () => {
        setCurrent(api.selectedScrollSnap());
      });
    }, [api]);

    return (
      <div ref={ref} className={cn('testimonial-carousel', className)} {...props}>
        <Carousel
          setApi={setApi}
          opts={{ direction: isRTL ? 'rtl' : 'ltr', loop: true }}
          plugins={[autoplayPlugin]}
          className="testimonial-carousel-container"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={`${testimonial.company}-${index}`} className="testimonial-carousel-item">
                <div className="testimonial-company-logo">
                  <Image
                    src={
                      companyLogoPath ? `${companyLogoPath}${testimonial.company}.svg` : `/${testimonial.company}.svg`
                    }
                    alt={`${testimonial.company} logo`}
                    fill
                    className="testimonial-company-logo-image"
                    draggable={false}
                  />
                </div>
                <p className="testimonial-review">{testimonial.review}</p>
                <h5 className="testimonial-name">{testimonial.name}</h5>
                <h5 className="testimonial-role">{testimonial.role}</h5>
                <div className="testimonial-avatar">
                  <Image
                    src={avatarPath ? `${avatarPath}${testimonial.avatar}` : testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="testimonial-avatar-image"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="testimonial-pagination">
          <div className="testimonial-pagination-dots">
            {testimonials.map((testimonial, index) => (
              <button
                key={`${testimonial.company}-dot-${index}`}
                type="button"
                className={cn('testimonial-pagination-dot', index === current && 'testimonial-pagination-dot-active')}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
);

TestimonialCarousel.displayName = 'TestimonialCarousel';
