import { usePlatforms } from '../hooks/usePlatforms';
import { useStores } from '../hooks/useStores';
import type { GameFilters } from '../../types/rawg';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Gamepad2, ShoppingBag, Star, Clock, Plus, ArrowUpAZ, History, SlidersHorizontal } from 'lucide-react';
import styles from './FilterBar.module.css';

const SORT_OPTIONS = [
  { value: '-rating', label: 'Meilleures notes', icon: Star },
  { value: '-released', label: 'Les plus récents', icon: Clock },
  { value: '-added', label: 'Récemment ajoutés', icon: Plus },
  { value: 'name', label: 'Nom (A–Z)', icon: ArrowUpAZ },
  { value: 'released', label: 'Les plus anciens', icon: History },
];

type Props = {
  filters: GameFilters;
  onChange: (filters: GameFilters) => void;
  onOpenGenres: () => void;
};

export default function FilterBar({ filters, onChange, onOpenGenres }: Props) {
  const { data: platformsData, isLoading: platformsLoading } = usePlatforms();
  const { data: storesData, isLoading: storesLoading } = useStores();

  return (
    <section className={styles.bar} aria-label="Filtres et recherche">
      <button
        className={styles.genresBtn}
        onClick={onOpenGenres}
        aria-label="Ouvrir le filtre par genre"
        type="button"
      >
        <SlidersHorizontal size={15} />
        Genres
      </button>

      <Input
        type="search"
        placeholder="Rechercher un jeu…"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className={styles.input}
        aria-label="Rechercher un jeu"
      />

      <Select
        value={filters.platforms || 'all'}
        onValueChange={(v) => onChange({ ...filters, platforms: v === 'all' ? '' : v })}
        disabled={platformsLoading}
      >
        <SelectTrigger className={cn(styles.selectTrigger)} aria-label="Filtrer par plateforme">
          <SelectValue placeholder="Plateformes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <span className={styles.iconItem}><Gamepad2 size={15} />Toutes les plateformes</span>
          </SelectItem>
          {platformsData?.results.map((p) => (
            <SelectItem key={p.id} value={String(p.id)}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.stores || 'all'}
        onValueChange={(v) => onChange({ ...filters, stores: v === 'all' ? '' : v })}
        disabled={storesLoading}
      >
        <SelectTrigger className={cn(styles.selectTrigger)} aria-label="Filtrer par store">
          <SelectValue placeholder="Stores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <span className={styles.iconItem}><ShoppingBag size={15} />Tous les stores</span>
          </SelectItem>
          {storesData?.results.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.ordering}
        onValueChange={(v) => onChange({ ...filters, ordering: v })}
      >
        <SelectTrigger className={cn(styles.selectTrigger)} aria-label="Trier par">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              <span className={styles.iconItem}><o.icon size={15} />{o.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
