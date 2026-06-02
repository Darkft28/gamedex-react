# Genre Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un drawer slide-in depuis la gauche, déclenché par un bouton "Genres" dans la FilterBar, qui affiche tous les genres RAWG en liste cliquable (nom + nombre de jeux) et filtre la grille de jeux.

**Architecture:** Nouveau composant `GenreDrawer` monté dans `GameListView`, état d'ouverture géré localement dans `GameListView`. Le bouton trigger est intégré comme premier élément de `FilterBar` via une prop `onOpenGenres`. Le filtre genre est ajouté à `GameFilters` et passé à `fetchGames` via `useGames`.

**Tech Stack:** React, TanStack Query, shadcn/ui (Button), Lucide React, CSS Modules, RAWG API `/genres`

---

### Task 1 : Types + API

**Files:**
- Modify: `src/types/rawg.ts`
- Modify: `src/components/services/rawgApi.ts`

- [ ] **Ajouter `RawgGenre` et `genres` dans `GameFilters`** dans `src/types/rawg.ts`

```ts
export type RawgGenre = {
  id: number;
  name: string;
  slug: string;
  games_count: number;
};

// Dans GameFilters, ajouter :
export type GameFilters = {
  search: string;
  platforms: string;
  stores: string;
  ordering: string;
  genres: string;  // ← nouveau
};

// Dans INITIAL_FILTERS, ajouter :
export const INITIAL_FILTERS: GameFilters = {
  search: '',
  platforms: '',
  stores: '',
  ordering: '-rating',
  genres: '',  // ← nouveau
};
```

- [ ] **Ajouter `fetchGenres()`** dans `src/components/services/rawgApi.ts`

```ts
export const fetchGenres = () =>
  rawgFetch<RawgPaginated<RawgGenre>>('/genres', { page_size: 40 });
```

---

### Task 2 : Hook `useGenres`

**Files:**
- Create: `src/components/hooks/useGenres.ts`

- [ ] **Créer le hook**

```ts
import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from '../services/rawgApi';

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: Infinity,
  });
}
```

---

### Task 3 : Mettre à jour `useGameListState`

**Files:**
- Modify: `src/components/hooks/useGameListState.ts`

- [ ] **Ajouter `genres` aux `activeFilters`**

```ts
const activeFilters = useMemo(
  () => ({
    platforms: filters.platforms,
    stores: filters.stores,
    ordering: filters.ordering,
    search: debouncedSearch,
    genres: filters.genres,  // ← nouveau
  }),
  [filters.platforms, filters.stores, filters.ordering, debouncedSearch, filters.genres],
);
```

---

### Task 4 : Composant `GenreDrawer`

**Files:**
- Create: `src/components/GenreDrawer/GenreDrawer.tsx`
- Create: `src/components/GenreDrawer/GenreDrawer.module.css`

- [ ] **Créer `GenreDrawer.tsx`**
- [ ] **Créer `GenreDrawer.module.css`**

---

### Task 5 : Mettre à jour `FilterBar`

**Files:**
- Modify: `src/components/FilterBar/FilterBar.tsx`

- [ ] **Ajouter prop `onOpenGenres` et bouton trigger**

---

### Task 6 : Mettre à jour `GameListView`

**Files:**
- Modify: `src/components/GameListView/GameListView.tsx`

- [ ] **Monter `GenreDrawer`, gérer état `open`, passer `onOpenGenres` à `FilterBar`**
