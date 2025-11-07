import { BottomNavigation } from '@/components/BottomNavigation/BottomNavigation';
import { Header } from '@/components/Header/Header';
import { useDirection } from '@/hooks/useDirection';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { direction } = useDirection();

  return (
    <div className="min-h-screen bg-background text-foreground" dir={direction}>
      <Header />
      {children}
      <BottomNavigation />
    </div>
  );
}
