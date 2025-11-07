import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavLink {
  to: string;
  label: string;
}

const navLinks: NavLink[] = [
  { to: '/', label: 'Home' },
  { to: '/counter', label: 'Counter' },
  { to: '/timer', label: 'Timer' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex gap-2 p-4">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Button key={link.to} asChild variant={isActive ? 'secondary' : 'ghost'}>
              <Link to={link.to}>{link.label}</Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
