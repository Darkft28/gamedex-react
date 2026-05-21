import { createContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { RawgGame } from '../types/rawg';

/**
 * Sous-ensemble minimal de RawgGame réellement utilisé par GameCard.
 * Réduire ce qui est sérialisé dans localStorage allège la taille et JSON.stringify.
 */
export type StoredGame = Pick<RawgGame, 'id' | 'name' | 'background_image' | 'rating'>;

type FavoritesContextType = {
  favorites: StoredGame[];
  addFavorite: (game: RawgGame) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
};

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<StoredGame[]>(() => {
    try {
      return (JSON.parse(localStorage.getItem('gamedex-favorites') ?? 'null') as StoredGame[]) ?? [];
    } catch {
      return [];
    }
  });

  // Persiste dans localStorage uniquement lors d'un vrai changement, pas au montage
  // (évite une écriture no-op puisque la valeur vient d'être lue)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('gamedex-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Set pour isFavorite O(1) au lieu de O(N) — évite N×M comparaisons par rendu de grille
  const favoritesSet = useMemo(() => new Set(favorites.map((g) => g.id)), [favorites]);

  const isFavorite = useCallback((id: number) => favoritesSet.has(id), [favoritesSet]);

  const addFavorite = useCallback(
    (game: RawgGame) =>
      setFavorites((prev) => {
        if (prev.some((g) => g.id === game.id)) return prev;
        // Stocke uniquement les champs utilisés par GameCard
        const { id, name, background_image, rating } = game;
        return [...prev, { id, name, background_image, rating }];
      }),
    [],
  );

  const removeFavorite = useCallback(
    (id: number) => setFavorites((prev) => prev.filter((g) => g.id !== id)),
    [],
  );

  const value = useMemo(
    () => ({ favorites, addFavorite, removeFavorite, isFavorite }),
    [favorites, addFavorite, removeFavorite, isFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
