import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface BenefitProps {
  illustrationSrc: string;
  illustrationAlt: string;
  headline: string;
  paragraph: string;
  bullets: string[];
  imagePosition: 'left' | 'right';
  isLoading?: boolean;
}

export function Benefit({
  illustrationSrc,
  illustrationAlt,
  headline,
  paragraph,
  bullets,
  imagePosition,
  isLoading = false,
}: BenefitProps) {
  return (
    <div className={`benefit-card benefit-${imagePosition}`}>
      <div className="benefit-illustration">
        {isLoading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <Image
            src={illustrationSrc}
            alt={illustrationAlt}
            width={400}
            height={400}
            className="benefit-illustration-image"
          />
        )}
      </div>
      <div className="benefit-content">
        <h2 className="benefit-headline">{isLoading ? <Skeleton className="h-8 w-full mb-4" /> : headline}</h2>
        <div className="benefit-paragraph">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </>
          ) : (
            paragraph
          )}
        </div>
        <ul className="benefit-bullets">
          {isLoading ? (
            <>
              <li>
                <Skeleton className="h-5 w-full mb-2" />
              </li>
              <li>
                <Skeleton className="h-5 w-full mb-2" />
              </li>
              <li>
                <Skeleton className="h-5 w-full mb-2" />
              </li>
              <li>
                <Skeleton className="h-5 w-3/4" />
              </li>
            </>
          ) : (
            bullets.map((bullet, index) => (
              <li key={`bullet-${index}-${bullet.substring(0, 20)}`} className="benefit-bullet">
                {bullet}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
