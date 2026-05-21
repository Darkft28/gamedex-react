import { useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FavoritesContext } from '../../context/FavoritesContext';
import type { StoredGame } from '../../context/FavoritesContext';
import type { RawgGame } from '../../types/rawg';

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites doit être utilisé dans FavoritesProvider');
  return ctx;
}

/**
 * Retourne un callback prêt à l'emploi qui bascule l'état favori d'un jeu
 * et affiche le toast correspondant.
 * Accepte null pour être appelé avant que le jeu soit chargé (ex: GameDetail).
 * Accepte RawgGame (depuis l'API) ou StoredGame (depuis les favoris).
 */
export function useToggleFavorite(game: RawgGame | StoredGame | null) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  return useCallback(() => {
    if (!game) return;
    if (isFavorite(game.id)) {
      removeFavorite(game.id);
      toast.success(`${game.name} retiré des favoris`);
    } else {
      addFavorite(game);
      toast.success(`${game.name} ajouté aux favoris`);
    }
  }, [game, isFavorite, addFavorite, removeFavorite]);
}
