'use client';

import { useState, useCallback } from 'react';
import { addFavorite, removeFavorite } from './api-client';
import { useAuth } from './auth-context';

export function useFavorite(recipeId: string, initialFavorited = false) {
  const { session } = useAuth();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, setPending] = useState(false);

  const toggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.access_token || pending) return;
    const next = !favorited;
    setFavorited(next); // optimistic
    setPending(true);
    try {
      if (next) {
        await addFavorite(recipeId, session.access_token);
      } else {
        await removeFavorite(recipeId, session.access_token);
      }
    } catch {
      setFavorited(!next); // rollback on error
    } finally {
      setPending(false);
    }
  }, [recipeId, session, favorited, pending]);

  return { favorited, toggle, authenticated: !!session };
}
