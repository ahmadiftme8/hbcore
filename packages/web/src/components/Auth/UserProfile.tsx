'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

export function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const initials =
    user.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ||
    user.email?.[0]?.toUpperCase() ||
    'U';

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.photoUrl || undefined} alt={user.name || 'User'} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        {user.name && <div className="text-sm font-medium">{user.name}</div>}
        {user.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
      </div>
      <Button onClick={handleSignOut} variant="outline" size="sm">
        Sign Out
      </Button>
    </div>
  );
}
