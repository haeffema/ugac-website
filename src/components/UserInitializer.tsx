'use client';

import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export default function UserInitializer() {
  const fetchCurrentUser = useUserStore((state) => state.fetchCurrentUser);
  const isLoading = useUserStore((state) => state.isLoading);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!isLoading && !user) {
      const storedUserId =
        typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (storedUserId) {
        fetchCurrentUser(storedUserId);
      }
    }
  }, [fetchCurrentUser, isLoading, user]);

  return null;
}
