'use client';

import type { User, UserInfo } from '@hbcore/types';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useTranslation } from '@/i18n/useTranslation';
import { storageService } from '@/services/storage.service';

interface CachedProfile {
  firstname: string | null;
  lastname: string | null;
  photoUrl: string | null;
}

export function UserProfile() {
  const { user, signOut, loading } = useAuth();
  const { t } = useTranslation();
  const [displayProfile, setDisplayProfile] = useState<CachedProfile | null>(null);

  useEffect(() => {
    const cached = storageService.getCachedProfile<CachedProfile>();
    if (cached) {
      setDisplayProfile(cached);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const profile: CachedProfile = {
        firstname: user.firstname ?? null,
        lastname: user.lastname ?? null,
        photoUrl: user.photoUrl ?? null,
      };
      setDisplayProfile(profile);
      storageService.setCachedProfile(profile);
    } else if (!loading) {
      setDisplayProfile(null);
      storageService.removeCachedProfile();
    }
  }, [user, loading]);

  const showProfile =
    displayProfile || (user && { firstname: user.firstname, lastname: user.lastname, photoUrl: user.photoUrl });

  if (!showProfile && !loading) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      storageService.removeCachedProfile();
    } catch (error) {
      // Error handling is done in AuthProvider
    }
  };

  const firstname = showProfile?.firstname || '';
  const lastname = showProfile?.lastname || '';
  const photoUrl = showProfile?.photoUrl || null;

  const initials =
    firstname && lastname
      ? `${firstname[0]}${lastname[0]}`.toUpperCase()
      : firstname
        ? firstname[0].toUpperCase()
        : lastname
          ? lastname[0].toUpperCase()
          : 'U';

  const displayName = [firstname, lastname].filter(Boolean).join(' ') || null;
  const userLabel = t.common.user;

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={photoUrl || undefined} alt={displayName || userLabel} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="text-sm font-medium">{displayName || userLabel}</div>
      <Button onClick={handleSignOut} variant="outline" size="sm">
        {t.auth.signOut}
      </Button>
    </div>
  );
}
