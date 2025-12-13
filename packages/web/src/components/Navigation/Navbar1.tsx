'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { UserProfile } from '@/components/Auth/UserProfile';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useTranslation } from '@/i18n/useTranslation';

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    title: string;
    url: string;
  };
}

const Navbar1 = ({
  logo = {
    url: '/',
    src: '/logo.png',
    alt: 'همبازی ایونت',
    title: 'همبازی ایونت',
  },
  menu,
  auth,
}: Navbar1Props) => {
  const { t, isRTL } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Map existing navigation items to menu structure
  const defaultMenu: MenuItem[] = [
    { title: t.navigation.events, url: '/events' },
    { title: t.navigation.blog, url: '/blog' },
    { title: t.navigation.support, url: '/support' },
    { title: t.navigation.about, url: '/about' },
    { title: t.navigation.contact, url: '/contact' },
  ];

  const defaultAuth = {
    title: t.common.auth,
    url: '/auth',
  };

  const menuItems = menu || defaultMenu;
  const authItem = auth || defaultAuth;

  return (
    <section className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-border py-5 shadow-md">
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              {logo.src && (
                <Image
                  src={logo.src}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg object-contain"
                  alt={logo.alt}
                />
              )}
              <span className="text-lg font-semibold tracking-tighter text-foreground">{logo.title}</span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>{menuItems.map((item) => renderMenuItem(item))}</NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            {authLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : user ? (
              <UserProfile />
            ) : (
              <Button asChild size="sm">
                <Link href={authItem.url}>{authItem.title}</Link>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={logo.url} className={`flex items-center gap-2 ${isRTL ? 'order-2' : 'order-1'}`}>
              {logo.src && (
                <Image
                  src={logo.src}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg object-contain"
                  alt={logo.alt}
                />
              )}
              {!logo.src && (
                <span className="text-lg font-semibold tracking-tighter text-foreground">{logo.title}</span>
              )}
            </Link>
            <div className={isRTL ? 'order-1' : 'order-2'}>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        {logo.src && (
                          <Image
                            src={logo.src}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-contain"
                            alt={logo.alt}
                          />
                        )}
                        {!logo.src && <span className="text-lg font-semibold">{logo.title}</span>}
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                      {menuItems.map((item) => renderMobileMenuItem(item, () => setIsSheetOpen(false)))}
                    </Accordion>
                    <div className="flex flex-col gap-3">
                      {authLoading ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                      ) : user ? (
                        <UserProfile />
                      ) : (
                        <Button asChild onClick={() => setIsSheetOpen(false)}>
                          <Link href={authItem.url}>{authItem.title}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  const textColorClass = 'text-foreground';
  const hoverTextColorClass = 'hover:text-primary';

  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger
          className={`bg-transparent! hover:bg-transparent! ${textColorClass} ${hoverTextColorClass} hover:[text-shadow:0_0_15px_var(--primary)/0.8] focus:bg-transparent! focus:text-primary focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1 data-[state=open]:bg-transparent! data-[state=open]:text-primary`}
        >
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all ${textColorClass} ${hoverTextColorClass} !hover:bg-transparent hover:[text-shadow:0_0_15px_var(--primary)/0.8] !focus:bg-transparent focus:text-primary focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1 !data-[active=true]:bg-transparent data-[active=true]:text-primary`}
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, onLinkClick?: () => void) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">{item.title}</AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} onLinkClick={onLinkClick} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }
  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold" onClick={onLinkClick}>
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item, onLinkClick }: { item: MenuItem; onLinkClick?: () => void }) => {
  return (
    <Link
      className="hover:bg-muted hover:text-accent-foreground flex min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      href={item.url}
      onClick={onLinkClick}
    >
      {item.icon && <div className="text-foreground">{item.icon}</div>}
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && <p className="text-muted-foreground text-sm leading-snug">{item.description}</p>}
      </div>
    </Link>
  );
};

export { Navbar1 };
