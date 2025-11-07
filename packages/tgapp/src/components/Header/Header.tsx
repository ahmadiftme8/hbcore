import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { APP_SCHEMA } from '@/config/app-schema';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 inset-x-0 bg-background border-b border-border z-50">
      <div className="flex items-center justify-between px-4 h-12">
        {/* Left: Profile Icon */}
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/10 h-8 w-8" aria-label="Profile">
          <User className="w-4 h-4 text-foreground" />
        </Button>

        {/* Center: App Title */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <h1 className="text-sm font-semibold text-foreground">{t(APP_SCHEMA.app.name)}</h1>
        </div>
      </div>
    </header>
  );
}
