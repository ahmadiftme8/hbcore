import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TRANSLATION_KEYS } from '@/config/translation-keys.constants';

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t(TRANSLATION_KEYS.home.title)}</CardTitle>
          <CardDescription>{t(TRANSLATION_KEYS.home.description)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t(TRANSLATION_KEYS.home.content)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
