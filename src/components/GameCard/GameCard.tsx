import { type MouseEvent, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites, useToggleFavorite } from '../hooks/useFavorites';
import { formatRating, cn } from '@/lib/utils';
import type { StoredGame } from '../../context/FavoritesContext';
import styles from './GameCard.module.css';

type Props = {
  // StoredGame couvre tous les champs utilisés ici (id, name, background_image, rating).
  // RawgGame (qui a des champs supplémentaires) y est structurellement assignable.
  game: StoredGame;
};

export default function GameCard({ game }: Props) {
  const { isFavorite } = useFavorites();
  const fav = isFavorite(game.id);
  const toggleFav = useToggleFavorite(game);

  const handleFavClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      toggleFav();
    },
    [toggleFav],
  );

  return (
    <Link to={`/games/${game.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          {game.background_image ? (
            <img
              src={game.background_image}
              alt={game.name}
              className={styles.image}
              loading="lazy"
            />
          ) : (
            <div
              className={styles.noImage}
              role="img"
              aria-label={`Image non disponible pour ${game.name}`}
            />
          )}
          <div className={styles.overlay}>
            <p className={styles.name}>{game.name}</p>
            <p className={styles.rating} aria-label={`Note : ${game.rating}`}>
              <span aria-hidden="true">⭐</span> {formatRating(game.rating)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleFavClick}
            className={cn(styles.favBtn, fav && styles.favActive)}
            aria-label={fav ? `Retirer ${game.name} des favoris` : `Ajouter ${game.name} aux favoris`}
            aria-pressed={fav}
          >
            <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </Link>
  );
}
