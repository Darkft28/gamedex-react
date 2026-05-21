import { useState, useEffect, useCallback, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Play } from 'lucide-react';
import { useFavorites, useToggleFavorite } from '../hooks/useFavorites';
import { formatRating, cn } from '@/lib/utils';
import type { RawgGame } from '../../types/rawg';
import type { StoredGame } from '../../context/FavoritesContext';
import styles from './HeroCarousel.module.css';

const AUTO_ADVANCE_MS = 5000;

function toStoredGame(game: RawgGame): StoredGame {
  return {
    id: game.id,
    name: game.name,
    background_image: game.background_image,
    rating: game.rating,
  };
}

type Props = {
  games: RawgGame[];
};

export default function HeroCarousel({ games }: Props) {
  const items = games.slice(0, 8);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const { isFavorite } = useFavorites();
  const activeGame = items[activeIndex];
  const fav = activeGame ? isFavorite(activeGame.id) : false;
  const toggleFav = useToggleFavorite(activeGame ? toStoredGame(activeGame) : null);

  const handleFavClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFav();
    },
    [toggleFav],
  );

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const prev = useCallback(
    () => goTo((activeIndex - 1 + items.length) % items.length),
    [goTo, activeIndex, items.length],
  );

  const next = useCallback(
    () => goTo((activeIndex + 1) % items.length),
    [goTo, activeIndex, items.length],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  if (!activeGame) return null;

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Jeux en vedette"
      aria-roledescription="carousel"
    >
      {/* Images empilées — crossfade par opacité */}
      <div className={styles.imageStack} aria-hidden="true">
        {items.map((game, i) =>
          game.background_image ? (
            <img
              key={game.id}
              src={game.background_image}
              alt=""
              className={cn(styles.bgImage, i === activeIndex && styles.bgImageActive)}
            />
          ) : null,
        )}
      </div>

      {/* Dégradés */}
      <div className={styles.gradientBottom} aria-hidden="true" />
      <div className={styles.gradientLeft} aria-hidden="true" />

      {/* Contenu bas-gauche */}
      <div className={styles.content}>
        <p className={styles.gameName}>{activeGame.name}</p>
        <p className={styles.gameRating} aria-label={`Note : ${activeGame.rating}`}>
          <span aria-hidden="true">⭐</span> {formatRating(activeGame.rating)}
        </p>
        <div className={styles.actions}>
          <Link
            to={`/games/${activeGame.id}`}
            className={styles.ctaButton}
            aria-label={`Voir la page de ${activeGame.name}`}
          >
            <Play size={15} fill="currentColor" />
            Voir le jeu
          </Link>
          <button
            type="button"
            onClick={handleFavClick}
            className={cn(styles.favBtn, fav && styles.favActive)}
            aria-label={
              fav
                ? `Retirer ${activeGame.name} des favoris`
                : `Ajouter ${activeGame.name} aux favoris`
            }
            aria-pressed={fav}
          >
            <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Miniatures de navigation (bas-droite) */}
      <div className={styles.thumbStrip} role="tablist" aria-label="Navigation du carousel">
        {items.map((game, i) => (
          <button
            key={game.id}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`${game.name}`}
            className={cn(styles.thumb, i === activeIndex && styles.thumbActive)}
            onClick={() => goTo(i)}
          >
            {game.background_image ? (
              <img src={game.background_image} alt={game.name} className={styles.thumbImg} />
            ) : (
              <div className={styles.thumbEmpty} />
            )}
            <div className={styles.thumbOverlay} aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* Flèches */}
      <button
        type="button"
        className={cn(styles.arrow, styles.arrowLeft)}
        onClick={prev}
        aria-label="Jeu précédent"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        className={cn(styles.arrow, styles.arrowRight)}
        onClick={next}
        aria-label="Jeu suivant"
      >
        <ChevronRight size={20} />
      </button>

      {/* Barre de progression */}
      <div className={styles.progressBar} aria-hidden="true">
        <div
          key={activeIndex}
          className={cn(styles.progressFill, !paused && styles.progressAnimate)}
        />
      </div>
    </section>
  );
}
