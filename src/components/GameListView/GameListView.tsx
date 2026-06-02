import { useState, type ReactNode, type RefObject } from 'react';
import FilterBar from '../FilterBar/FilterBar';
import GameCard from '../GameCard/GameCard';
import GenreDrawer from '../GenreDrawer/GenreDrawer';
import type { GameFilters, RawgGame } from '../../types/rawg';
import styles from './GameListView.module.css';

type Props = {
  title?: string;
  hero?: ReactNode;
  games: RawgGame[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  sentinelRef: RefObject<HTMLDivElement>;
  filters: GameFilters;
  setFilters: (filters: GameFilters) => void;
};

export default function GameListView({
  title,
  hero,
  games,
  isLoading,
  isError,
  isFetchingNextPage,
  sentinelRef,
  filters,
  setFilters,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.page}>
      {title && <h1 className={styles.title}>{title}</h1>}

      {hero}

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onOpenGenres={() => setDrawerOpen(true)}
      />

      <GenreDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
      />

      {isLoading && (
        <div className={styles.grid} aria-busy="true" aria-label="Chargement des jeux">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={styles.skeleton} aria-hidden="true" />
          ))}
        </div>
      )}

      {!isLoading && !isError && games.length === 0 && (
        <p className={styles.empty}>Aucun jeu trouvé.</p>
      )}

      {games.length > 0 && (
        <div className={styles.grid}>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      {isFetchingNextPage && (
        <p className={styles.loadingMore} aria-live="polite">
          Chargement…
        </p>
      )}
    </div>
  );
}
