'use client';

import { useState, useCallback } from 'react';
import { toggleFavorite } from './actions';
import { useAuth } from './auth-context';

export function useFavorite(recipeId: string, initialFavorited = false) {
  const { session } = useAuth();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, setPending] = useState(false);

  const toggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault(); // o botão vive dentro do Link do card
    if (!session || pending) return;

    const next = !favorited;
    setFavorited(next); // otimista
    setPending(true);

    const result = await toggleFavorite(recipeId, next);
    if (!result.ok) setFavorited(!next);

    setPending(false);
  }, [recipeId, session, favorited, pending]);

  return { favorited, toggle, authenticated: !!session };
}
