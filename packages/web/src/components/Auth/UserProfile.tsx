'use client';

import type { User, UserInfo } from '@hbcore/types';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useTranslation } from '@/i18n/useTranslation';

const PROFILE_CACHE_KEY = 'hbcore-profile-cache';

interface CachedProfile {
  firstname: string | null;
  lastname: string | null;
  photoUrl: string | null;
}

function getCachedProfile(): CachedProfile | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cached = localStorage.getItem(PROFILE_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as CachedProfile;
    }
  } catch (error) {
    console.error('Failed to read cached profile:', error);
  }

  return null;
}

function saveCachedProfile(user: User & UserInfo): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const cache: CachedProfile = {
      firstname: user.firstname ?? null,
      lastname: user.lastname ?? null,
      photoUrl: user.photoUrl ?? null,
    };
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to cache profile:', error);
  }
}

function clearCachedProfile(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear cached profile:', error);
  }
}

export function UserProfile() {
  const { user, signOut, loading } = useAuth();
  const { t } = useTranslation();
  const [displayProfile, setDisplayProfile] = useState<CachedProfile | null>(null);

  // Load cached profile on mount for immediate display
  useEffect(() => {
    const cached = getCachedProfile();
    if (cached) {
      setDisplayProfile(cached);
    }
  }, []);

  // Update display profile when user data loads
  useEffect(() => {
    if (user) {
      const profile: CachedProfile = {
        firstname: user.firstname ?? null,
        lastname: user.lastname ?? null,
        photoUrl: user.photoUrl ?? null,
      };
      setDisplayProfile(profile);
      saveCachedProfile(user);
    } else if (!loading) {
      // Session expired or logged out
      setDisplayProfile(null);
      clearCachedProfile();
    }
  }, [user, loading]);

  // Show cached profile if available, even if user is not loaded yet
  const showProfile =
    displayProfile || (user && { firstname: user.firstname, lastname: user.lastname, photoUrl: user.photoUrl });

  if (!showProfile && !loading) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      clearCachedProfile();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const firstname = showProfile?.firstname || '';
  const lastname = showProfile?.lastname || '';
  const photoUrl = showProfile?.photoUrl || null;

  // Generate initials from firstname and lastname
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
