import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import './EventCard.css';

export interface EventData {
  id: string;
  title: { en: string; fa: string };
  description: { en: string; fa: string };
  image: string;
  date: Date;
}

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
  const { i18n } = useTranslation();
  const language = i18n.language as 'en' | 'fa';
  const title = event.title[language];
  const description = event.description[language];

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(language === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card className="event-card">
      <CardContent className="event-card-content">
        <div className="event-image-container">
          <img src={event.image} alt={title} className="event-image" />
        </div>
        <div className="event-info">
          <h3 className="event-title">{title}</h3>
          <p className="event-description">{description}</p>
          <p className="event-date">{formatDate(event.date)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
