import { X } from 'lucide-react';
import { useGenres } from '../hooks/useGenres';
import type { GameFilters } from '../../types/rawg';
import styles from './GenreDrawer.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  filters: GameFilters;
  onChange: (filters: GameFilters) => void;
};

export default function GenreDrawer({ open, onClose, filters, onChange }: Props) {
  const { data, isLoading } = useGenres();

  const select = (genreId: string) => {
    onChange({ ...filters, genres: genreId });
    onClose();
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.backdropVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-label="Filtrer par genre"
        aria-hidden={!open}
      >
        <div className={styles.header}>
          <span className={styles.title}>Genres</span>
          <button className={styles.close} onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <ul className={styles.list} role="listbox" aria-label="Genres disponibles">
          <li
            role="option"
            aria-selected={filters.genres === ''}
            className={`${styles.item} ${filters.genres === '' ? styles.itemActive : ''}`}
            onClick={() => select('')}
          >
            <span className={styles.itemName}>Tous les jeux</span>
          </li>

          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className={styles.skeleton} aria-hidden="true" />
            ))}

          {data?.results.map((genre) => (
            <li
              key={genre.id}
              role="option"
              aria-selected={filters.genres === String(genre.id)}
              className={`${styles.item} ${filters.genres === String(genre.id) ? styles.itemActive : ''}`}
              onClick={() => select(String(genre.id))}
            >
              <span className={styles.itemName}>{genre.name}</span>
              <span className={styles.itemCount}>{genre.games_count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
