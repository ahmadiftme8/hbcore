import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('home.title')}</CardTitle>
          <CardDescription>{t('home.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('home.content')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
