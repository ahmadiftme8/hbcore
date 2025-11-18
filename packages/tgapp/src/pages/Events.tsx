import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventCard, type EventData } from '@/components/EventCard/EventCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TRANSLATION_KEYS } from '@/config/translation-keys.constants';

const DEMO_EVENTS: EventData[] = [
  {
    id: 'founders-17',
    title: {
      en: 'Founders 17',
      fa: 'بنیانگذاران ۱۷',
    },
    description: {
      en: 'From boardgame to networking',
      fa: 'از بازی رومیزی تا شبکه‌سازی',
    },
    image: eventImage17,
    date: new Date(2025, 10, 13), // November 13, 2025 (month is 0-indexed)
  },
  {
    id: 'english-2',
    title: {
      en: 'English 2',
      fa: 'انگلیسی ۲',
    },
    description: {
      en: 'Learn english by playing games',
      fa: 'انگلیسی را با بازی یاد بگیرید',
    },
    image: eventImageE,
    date: new Date(2025, 10, 11), // November 11, 2025
  },
];

export function Events() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'future' | 'previous'>('future');

  const today = new Date(2025, 10, 10); // November 10, 2025
  const futureEvents = DEMO_EVENTS.filter((event) => event.date >= today);
  const previousEvents = DEMO_EVENTS.filter((event) => event.date < today);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'future' | 'previous')}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="future">{t(TRANSLATION_KEYS.events.futureEvents)}</TabsTrigger>
          <TabsTrigger value="previous">{t(TRANSLATION_KEYS.events.previousEvents)}</TabsTrigger>
        </TabsList>
        <TabsContent value="future" className="mt-4">
          <div className="space-y-4">
            {futureEvents.length > 0 ? (
              futureEvents.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p className="text-center text-muted-foreground py-8">{t(TRANSLATION_KEYS.events.noFutureEvents)}</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="previous" className="mt-4">
          <div className="space-y-4">
            {previousEvents.length > 0 ? (
              previousEvents.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p className="text-center text-muted-foreground py-8">{t(TRANSLATION_KEYS.events.noPreviousEvents)}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
