import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import type { GameFilters } from '../../types/rawg';
import { INITIAL_FILTERS } from '../../types/rawg';

/**
 * Gère l'état partagé des pages de liste de jeux (filtres + debounce de la recherche).
 * Utilisé par Home et Publisher pour éviter la duplication.
 */
export function useGameListState() {
  const [filters, setFilters] = useState<GameFilters>(INITIAL_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 400);

  const activeFilters = useMemo(
    () => ({
      platforms: filters.platforms,
      stores: filters.stores,
      ordering: filters.ordering,
      search: debouncedSearch,
    }),
    // Dépendances précises pour éviter le recalcul à chaque frappe intermédiaire
    [filters.platforms, filters.stores, filters.ordering, debouncedSearch],
  );

  return { filters, setFilters, activeFilters };
}
