'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useTranslation } from '@/i18n/useTranslation';
import './Navigation.css';

const navigationItems = [
  { key: 'home', href: '#hero' },
  { key: 'features', href: '#features' },
  { key: 'benefits', href: '#benefits' },
  { key: 'proof', href: '#proof' },
  { key: 'objections', href: '#objections' },
  { key: 'cta', href: '#cta' },
] as const;

type NavigationKey = (typeof navigationItems)[number]['key'];

export function Navigation() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navigation ${isScrolled ? 'navigation-scrolled' : ''}`}>
      <div className="navigation-container">
        <div className="navigation-brand">
          <Link href="#" className="navigation-brand-link">
            Logo
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.key}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={item.href}>{t(`navigation.${item.key}` as `navigation.${NavigationKey}`)}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="navigation-actions">
          {/* <button
            type="button"
            onClick={toggleLanguage}
            className="navigation-language-switcher"
            aria-label="Switch language"
          >
            {language === 'fa' ? 'EN' : 'FA'}
          </button> */}
          <Link href="#" className="navigation-login-link">
            {t('common.login')} →
          </Link>
        </div>
      </div>
    </nav>
  );
}
