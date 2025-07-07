'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PublicUser } from '@/types/user';

interface UserContextType {
  user: PublicUser | null;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<PublicUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: PublicUser | null;
}) => {
  const [user, setUser] = useState<PublicUser | null>(initialUser);

  // Always fetch latest user data on mount for full stats
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        console.error('Failed to fetch user on mount', e);
      }
    })();
  }, []);

  const refreshUser = useCallback(async (newData?: PublicUser) => {
    if (newData) {
      setUser(newData);
    } else {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        console.error('Failed to refresh user', e);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
