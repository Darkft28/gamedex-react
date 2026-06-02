import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatRating } from '@/lib/utils';
import type { RawgGame } from '../../types/rawg';
import styles from './GameSeries.module.css';

type Props = {
  games: RawgGame[];
  isLoading: boolean;
  currentId: string | undefined;
};

export default function GameSeries({ games, isLoading, currentId }: Props) {
  const filtered = games.filter((g) => String(g.id) !== currentId);

  if (isLoading) {
    return (
      <div className={styles.track}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.skeleton} aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) return null;

  return (
    <div className={styles.track} role="list" aria-label="Autres jeux de la série">
      {filtered.map((game) => (
        <Link
          key={game.id}
          to={`/games/${game.id}`}
          className={styles.card}
          role="listitem"
          aria-label={game.name}
        >
          <div className={styles.imgWrap}>
            {game.background_image ? (
              <img
                src={game.background_image}
                alt={game.name}
                className={styles.img}
                loading="lazy"
              />
            ) : (
              <div className={styles.imgFallback} aria-hidden="true" />
            )}
          </div>
          <div className={styles.info}>
            <p className={styles.name}>{game.name}</p>
            {game.rating > 0 && (
              <span className={styles.rating}>
                <Star size={11} fill="currentColor" aria-hidden="true" />
                {formatRating(game.rating)}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
