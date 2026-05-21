# shadcn/ui + GameDetail + Pages manquantes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer GameCard et FilterBar vers shadcn/ui, implémenter GameDetail, Publisher et Favorites.

**Architecture:** Les composants shadcn (basés sur Radix UI) sont installés dans `src/components/ui/`. GameCard et FilterBar les réutilisent. GameDetail utilise les hooks existants (useGameDetail, useGameTrailers, useGameAchievements). Publisher reprend exactement la logique de Home. Favorites lit depuis FavoritesContext.

**Tech Stack:** React 18, TypeScript, TanStack Query v5, shadcn/ui (Radix UI), Tailwind CSS, CSS Modules, Lucide React, react-toastify

---

## Fichiers

| Fichier | Action | Rôle |
|---|---|---|
| `tailwind.config.js` | Modifier | Ajouter `.ts` `.tsx` au content |
| `src/lib/utils.ts` | Modifier | Typer `cn()` pour strict mode |
| `components.json` | Créer | Config shadcn/ui |
| `src/components/styles/globals.css` | Modifier | Ajouter variables CSS shadcn |
| `src/types/rawg.ts` | Modifier | Ajouter RawgGameDetail, RawgAchievement, RawgTrailer, RawgPublisher |
| `src/components/services/rawgApi.ts` | Modifier | Ajouter fetchPublisher, typer fetchGameAchievements/Trailers |
| `src/components/hooks/useGameDetail.ts` | Modifier | Typer les 3 hooks avec les nouveaux types |
| `src/components/hooks/usePublisherGames.ts` | Créer | Infinite query filtrée par publisher |
| `src/components/hooks/usePublisher.ts` | Créer | Query pour infos d'un publisher |
| `src/components/ui/` | Créer (shadcn) | card, input, select, badge, skeleton, button, separator, tabs, scroll-area, aspect-ratio |
| `src/components/GameCard/GameCard.tsx` | Modifier | Utiliser shadcn Card + CardContent |
| `src/components/GameCard/GameCard.module.css` | Modifier | Adapter pour shadcn Card |
| `src/components/FilterBar/FilterBar.tsx` | Modifier | Utiliser shadcn Input + Select |
| `src/components/FilterBar/FilterBar.module.css` | Modifier | Adapter pour shadcn |
| `src/pages/GameDetail/GameDetail.tsx` | Modifier | Implémenter la page complète |
| `src/pages/GameDetail/GameDetail.module.css` | Modifier | Styles de la page |
| `src/pages/Publisher/Publisher.tsx` | Modifier | Même design que Home |
| `src/pages/Publisher/Publisher.module.css` | Modifier | Copie de Home.module.css |
| `src/pages/Favorites/Favorites.tsx` | Modifier | Grille GameCard + état vide |
| `src/pages/Favorites/Favorites.module.css` | Modifier | Grille + état vide |

---

## Task 1 : Setup shadcn/ui

**Fichiers :**
- Modifier : `tailwind.config.js`
- Modifier : `src/lib/utils.ts`
- Créer : `components.json`
- Modifier : `src/components/styles/globals.css`

- [ ] **Corriger `tailwind.config.js`** (ajouter `.ts` et `.tsx` au content, sinon Tailwind ignore les fichiers TypeScript)

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Typer `src/lib/utils.ts`** (requis par strict mode TypeScript)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Créer `components.json`** à la racine du projet

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/components/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Ajouter les variables CSS shadcn dans `src/components/styles/globals.css`**

Ajouter ce bloc **après** les directives `@tailwind` et **avant** les variables `--color-*` existantes :

```css
@layer base {
  :root {
    --background: 210 40% 98%;
    --foreground: 222 47% 18%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 18%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 18%;
    --primary: 239 84% 67%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 94%;
    --secondary-foreground: 222 47% 18%;
    --muted: 210 40% 94%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 94%;
    --accent-foreground: 222 47% 18%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 239 84% 67%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 49% 8%;
    --foreground: 217 33% 92%;
    --card: 240 39% 14%;
    --card-foreground: 217 33% 92%;
    --popover: 240 39% 14%;
    --popover-foreground: 217 33% 92%;
    --primary: 239 84% 67%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 30% 20%;
    --secondary-foreground: 217 33% 92%;
    --muted: 240 30% 20%;
    --muted-foreground: 215 20% 65%;
    --accent: 240 30% 20%;
    --accent-foreground: 217 33% 92%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 217 33% 92%;
    --border: 240 30% 22%;
    --input: 240 30% 22%;
    --ring: 239 84% 67%;
  }
}
```

- [ ] **Installer les composants shadcn** via WSL

```bash
wsl bash -c "cd /home/baptiste/gamedex-react && npx shadcn@latest add card input select badge skeleton button separator tabs scroll-area aspect-ratio --yes"
```

Attendu : les fichiers apparaissent dans `src/components/ui/` (card.tsx, input.tsx, select.tsx, badge.tsx, skeleton.tsx, button.tsx, separator.tsx, tabs.tsx, scroll-area.tsx, aspect-ratio.tsx)

---

## Task 2 : Types, API et hooks

**Fichiers :**
- Modifier : `src/types/rawg.ts`
- Modifier : `src/components/services/rawgApi.ts`
- Modifier : `src/components/hooks/useGameDetail.ts`
- Créer : `src/components/hooks/usePublisherGames.ts`
- Créer : `src/components/hooks/usePublisher.ts`

- [ ] **Ajouter les types manquants dans `src/types/rawg.ts`**

Ajouter à la fin du fichier :

```typescript
export type RawgGameDetail = RawgGame & {
  description_raw: string;
  released: string | null;
  metacritic: number | null;
  genres: Array<{ id: number; name: string; slug: string }>;
  publishers: Array<{ id: number; name: string; slug: string }>;
  developers: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string; language: string }>;
};

export type RawgAchievement = {
  id: number;
  name: string;
  description: string;
  image: string;
  percent: string;
};

export type RawgTrailer = {
  id: number;
  name: string;
  preview: string;
  data: { max: string };
};

export type RawgPublisher = {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string | null;
};
```

- [ ] **Mettre à jour `src/components/services/rawgApi.ts`**

Mettre à jour les imports et les fonctions existantes, et ajouter `fetchPublisher` :

```typescript
import type { RawgGame, RawgGameDetail, RawgPlatform, RawgStore, RawgPaginated, RawgAchievement, RawgTrailer, RawgPublisher } from '../../types/rawg';

const BASE_URL = 'https://api.rawg.io/api';
const API_KEY = import.meta.env.VITE_RAWG_API_KEY as string;

type Params = Record<string, string | number | undefined | null>;

async function rawgFetch<T>(endpoint: string, params: Params = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('key', API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`RAWG ${res.status}`);
  return res.json() as Promise<T>;
}

export const fetchGames = (params: Params) =>
  rawgFetch<RawgPaginated<RawgGame>>('/games', params);
export const fetchGameDetail = (id: number | string) =>
  rawgFetch<RawgGameDetail>(`/games/${id}`);
export const fetchGameAchievements = (id: number | string) =>
  rawgFetch<RawgPaginated<RawgAchievement>>(`/games/${id}/achievements`);
export const fetchGameTrailers = (id: number | string) =>
  rawgFetch<RawgPaginated<RawgTrailer>>(`/games/${id}/movies`);
export const fetchPublisherGames = (id: number | string, params: Params) =>
  rawgFetch<RawgPaginated<RawgGame>>('/games', { publishers: id, ...params });
export const fetchPlatforms = () =>
  rawgFetch<RawgPaginated<RawgPlatform>>('/platforms');
export const fetchStores = () =>
  rawgFetch<RawgPaginated<RawgStore>>('/stores');
export const fetchPublisher = (id: number | string) =>
  rawgFetch<RawgPublisher>(`/publishers/${id}`);
```

- [ ] **Mettre à jour `src/components/hooks/useGameDetail.ts`**

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchGameDetail, fetchGameAchievements, fetchGameTrailers } from '../services/rawgApi';

export function useGameDetail(id: string) {
  return useQuery({
    queryKey: ['game', id],
    queryFn: () => fetchGameDetail(id),
    enabled: !!id,
  });
}

export function useGameAchievements(id: string) {
  return useQuery({
    queryKey: ['game-achievements', id],
    queryFn: () => fetchGameAchievements(id),
    enabled: !!id,
  });
}

export function useGameTrailers(id: string) {
  return useQuery({
    queryKey: ['game-trailers', id],
    queryFn: () => fetchGameTrailers(id),
    enabled: !!id,
  });
}
```

- [ ] **Créer `src/components/hooks/usePublisherGames.ts`**

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPublisherGames } from '../services/rawgApi';
import type { GameFilters } from '../../types/rawg';

export function usePublisherGames(publisherId: string, filters: Partial<GameFilters>) {
  return useInfiniteQuery({
    queryKey: ['publisher-games', publisherId, filters],
    queryFn: ({ pageParam }) =>
      fetchPublisherGames(publisherId, { ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    enabled: !!publisherId,
  });
}
```

- [ ] **Créer `src/components/hooks/usePublisher.ts`**

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchPublisher } from '../services/rawgApi';

export function usePublisher(id: string) {
  return useQuery({
    queryKey: ['publisher', id],
    queryFn: () => fetchPublisher(id),
    enabled: !!id,
    staleTime: Infinity,
  });
}
```

---

## Task 3 : GameCard avec shadcn Card

**Fichiers :**
- Modifier : `src/components/GameCard/GameCard.tsx`
- Modifier : `src/components/GameCard/GameCard.module.css`

- [ ] **Remplacer `GameCard.tsx`**

```typescript
import { type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFavorites } from '../hooks/useFavorites';
import type { RawgGame } from '../../types/rawg';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import styles from './GameCard.module.css';

type Props = {
  game: RawgGame;
};

export default function GameCard({ game }: Props) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(game.id);

  const toggleFavorite = (e: MouseEvent) => {
    e.preventDefault();
    if (fav) {
      removeFavorite(game.id);
      toast.success(`${game.name} retiré des favoris`);
    } else {
      addFavorite(game);
      toast.success(`${game.name} ajouté aux favoris`);
    }
  };

  return (
    <Link to={`/games/${game.id}`} className={styles.cardLink}>
      <Card className={styles.card}>
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
          <button
            type="button"
            onClick={toggleFavorite}
            className={cn(styles.favBtn, fav && styles.favActive)}
            aria-label={fav ? `Retirer ${game.name} des favoris` : `Ajouter ${game.name} aux favoris`}
            aria-pressed={fav}
          >
            <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>
        <CardContent className={styles.info}>
          <p className={styles.name}>{game.name}</p>
          <p className={styles.rating} aria-label={`Note : ${game.rating}`}>
            <span aria-hidden="true">⭐</span>{' '}
            {game.rating > 0 ? game.rating.toFixed(1) : 'N/A'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
```

- [ ] **Remplacer `GameCard.module.css`**

```css
.cardLink {
  text-decoration: none;
  color: inherit;
  display: block;
}

.card {
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  background-color: var(--color-surface);
  padding: 0;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.cardLink:focus-visible .card {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.imageWrapper {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.noImage {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.04);
}

.favBtn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background-color 0.15s;
}

.favBtn:hover,
.favActive {
  background-color: var(--color-primary);
}

.favBtn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.info {
  padding: 0.75rem !important;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.rating {
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.7;
}
```

---

## Task 4 : FilterBar avec shadcn Input + Select

**Fichiers :**
- Modifier : `src/components/FilterBar/FilterBar.tsx`
- Modifier : `src/components/FilterBar/FilterBar.module.css`

- [ ] **Remplacer `FilterBar.tsx`**

```typescript
import { usePlatforms } from '../hooks/usePlatforms';
import { useStores } from '../hooks/useStores';
import type { GameFilters } from '../../types/rawg';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import styles from './FilterBar.module.css';

const SORT_OPTIONS = [
  { value: '-rating', label: 'Meilleures notes' },
  { value: '-released', label: 'Les plus récents' },
  { value: '-added', label: 'Récemment ajoutés' },
  { value: 'name', label: 'Nom (A–Z)' },
  { value: 'released', label: 'Les plus anciens' },
];

type Props = {
  filters: GameFilters;
  onChange: (filters: GameFilters) => void;
};

export default function FilterBar({ filters, onChange }: Props) {
  const { data: platformsData, isLoading: platformsLoading } = usePlatforms();
  const { data: storesData, isLoading: storesLoading } = useStores();

  return (
    <section className={styles.bar} aria-label="Filtres et recherche">
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
        <SelectTrigger className={styles.select} aria-label="Filtrer par plateforme">
          <SelectValue placeholder="Toutes les plateformes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les plateformes</SelectItem>
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
        <SelectTrigger className={styles.select} aria-label="Filtrer par store">
          <SelectValue placeholder="Tous les stores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les stores</SelectItem>
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
        <SelectTrigger className={styles.select} aria-label="Trier par">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
```

- [ ] **Remplacer `FilterBar.module.css`**

```css
.bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--color-bg);
}

.input {
  flex: 1;
  min-width: 200px;
}

.select {
  min-width: 160px;
}
```

---

## Task 5 : GameDetail

**Fichiers :**
- Modifier : `src/pages/GameDetail/GameDetail.tsx`
- Modifier : `src/pages/GameDetail/GameDetail.module.css`

- [ ] **Remplacer `GameDetail.tsx`**

```typescript
import { useParams, Link } from 'react-router-dom';
import { Heart, ArrowLeft, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGameDetail, useGameTrailers, useGameAchievements } from '../../components/hooks/useGameDetail';
import { useFavorites } from '../../components/hooks/useFavorites';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import styles from './GameDetail.module.css';

function GameDetailSkeleton() {
  return (
    <div className={styles.page}>
      <Skeleton className={styles.heroSkeleton} />
      <div className={styles.badges}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={styles.badgeSkeleton} />
        ))}
      </div>
      <Skeleton className={styles.metaSkeleton} />
      <Skeleton className={styles.descSkeleton} />
    </div>
  );
}

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: game, isLoading, isError } = useGameDetail(id ?? '');
  const { data: trailersData } = useGameTrailers(id ?? '');
  const { data: achievementsData } = useGameAchievements(id ?? '');
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  if (isLoading) return <GameDetailSkeleton />;

  if (isError || !game) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>Impossible de charger ce jeu.</p>
      </div>
    );
  }

  const fav = isFavorite(game.id);
  const trailer = trailersData?.results[0];
  const achievements = achievementsData?.results ?? [];

  const toggleFavorite = () => {
    if (fav) {
      removeFavorite(game.id);
      toast.success(`${game.name} retiré des favoris`);
    } else {
      addFavorite(game);
      toast.success(`${game.name} ajouté aux favoris`);
    }
  };

  return (
    <div className={styles.page}>
      <Link to="/">
        <Button variant="ghost" size="sm" className={styles.backBtn}>
          <ArrowLeft size={16} />
          Retour
        </Button>
      </Link>

      {/* Hero */}
      <div className={styles.hero}>
        {game.background_image && (
          <img
            src={game.background_image}
            alt={game.name}
            className={styles.heroImage}
          />
        )}
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>{game.name}</h1>
          <div className={styles.heroActions}>
            <span className={styles.rating}>
              <Star size={16} fill="currentColor" aria-hidden="true" />
              {game.rating > 0 ? game.rating.toFixed(1) : 'N/A'}
            </span>
            {game.metacritic !== null && game.metacritic !== undefined && (
              <Badge variant="outline" className={styles.metacritic}>
                Metacritic : {game.metacritic}
              </Badge>
            )}
            <Button
              variant={fav ? 'default' : 'outline'}
              size="sm"
              onClick={toggleFavorite}
              aria-pressed={fav}
            >
              <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
              {fav ? 'Favori' : 'Ajouter aux favoris'}
            </Button>
          </div>
        </div>
      </div>

      {/* Badges plateformes + genres */}
      <div className={styles.badges}>
        {game.platforms?.map(({ platform }) => (
          <Badge key={platform.id} variant="secondary">
            {platform.name}
          </Badge>
        ))}
        {game.genres?.map((genre) => (
          <Badge key={genre.id} variant="outline">
            {genre.name}
          </Badge>
        ))}
      </div>

      {/* Méta : date, éditeur, développeur */}
      <div className={styles.metaRow}>
        {game.released && (
          <span>
            Sortie : {new Date(game.released).toLocaleDateString('fr-FR')}
          </span>
        )}
        {game.publishers && game.publishers.length > 0 && (
          <span>
            Éditeur :{' '}
            {game.publishers.map((pub, i) => (
              <span key={pub.id}>
                {i > 0 && ', '}
                <Link to={`/publisher/${pub.id}`} className={styles.pubLink}>
                  {pub.name}
                </Link>
              </span>
            ))}
          </span>
        )}
        {game.developers && game.developers.length > 0 && (
          <span>
            Développeur : {game.developers.map((d) => d.name).join(', ')}
          </span>
        )}
      </div>

      <Separator className={styles.sep} />

      {/* Tabs : Description | Achievements */}
      <Tabs defaultValue="description" className={styles.tabs}>
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="achievements">
            Achievements{achievements.length > 0 ? ` (${achievements.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <p className={styles.description}>
            {game.description_raw || 'Aucune description disponible.'}
          </p>
        </TabsContent>

        <TabsContent value="achievements">
          {achievements.length === 0 ? (
            <p className={styles.empty}>Aucun achievement disponible.</p>
          ) : (
            <ScrollArea className={styles.scrollArea}>
              {achievements.map((a) => (
                <div key={a.id} className={styles.achievement}>
                  {a.image && (
                    <img
                      src={a.image}
                      alt={a.name}
                      className={styles.achievementImg}
                    />
                  )}
                  <div className={styles.achievementBody}>
                    <p className={styles.achievementName}>{a.name}</p>
                    <p className={styles.achievementDesc}>{a.description}</p>
                    <p className={styles.achievementPercent}>
                      {a.percent}% des joueurs
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      {/* Trailer */}
      {trailer && (
        <>
          <Separator className={styles.sep} />
          <h2 className={styles.sectionTitle}>Trailer</h2>
          <video
            src={trailer.data.max}
            poster={trailer.preview}
            controls
            className={styles.trailer}
            aria-label={`Trailer : ${trailer.name}`}
          />
        </>
      )}
    </div>
  );
}
```

- [ ] **Remplacer `GameDetail.module.css`**

```css
.page {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 4rem;
}

.backBtn {
  margin-bottom: 1rem;
}

/* Hero */
.hero {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
  min-height: 300px;
  background-color: var(--color-surface);
}

.heroImage {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.heroOverlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.heroTitle {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.heroActions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  color: #fbbf24;
  font-size: 1rem;
}

.metacritic {
  color: #86efac;
  border-color: #86efac;
}

/* Badges */
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* Méta */
.metaRow {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 1rem;
}

.pubLink {
  color: var(--color-primary);
  text-decoration: none;
}

.pubLink:hover {
  text-decoration: underline;
}

/* Séparateur */
.sep {
  margin: 1.5rem 0;
}

/* Tabs */
.tabs {
  margin-bottom: 1.5rem;
}

.description {
  white-space: pre-line;
  line-height: 1.7;
  font-size: 0.9375rem;
  opacity: 0.9;
  margin-top: 1rem;
}

.empty {
  text-align: center;
  opacity: 0.6;
  padding: 2rem 0;
}

/* ScrollArea achievements */
.scrollArea {
  height: 400px;
  padding-right: 0.5rem;
  margin-top: 1rem;
}

.achievement {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.achievement:last-child {
  border-bottom: none;
}

.achievementImg {
  width: 3rem;
  height: 3rem;
  border-radius: 0.375rem;
  object-fit: cover;
  flex-shrink: 0;
}

.achievementBody {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.achievementName {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.achievementDesc {
  margin: 0;
  font-size: 0.8125rem;
  opacity: 0.7;
}

.achievementPercent {
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.5;
}

/* Section trailer */
.sectionTitle {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.trailer {
  width: 100%;
  border-radius: 0.5rem;
  background: #000;
}

/* Error */
.error {
  text-align: center;
  opacity: 0.6;
  padding: 4rem 0;
}

/* Skeletons */
.heroSkeleton {
  height: 400px;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.badgeSkeleton {
  height: 1.5rem;
  width: 5rem;
  border-radius: 9999px;
}

.metaSkeleton {
  height: 1.25rem;
  width: 50%;
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
}

.descSkeleton {
  height: 10rem;
  border-radius: 0.5rem;
}
```

---

## Task 6 : Publisher

**Fichiers :**
- Modifier : `src/pages/Publisher/Publisher.tsx`
- Modifier : `src/pages/Publisher/Publisher.module.css`

- [ ] **Remplacer `Publisher.tsx`**

```typescript
import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePublisherGames } from '../../components/hooks/usePublisherGames';
import { usePublisher } from '../../components/hooks/usePublisher';
import { useDebounce } from '../../components/hooks/useDebounce';
import FilterBar from '../../components/FilterBar/FilterBar';
import GameCard from '../../components/GameCard/GameCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { GameFilters, RawgGame } from '../../types/rawg';
import styles from './Publisher.module.css';

const INITIAL_FILTERS: GameFilters = {
  search: '',
  platforms: '',
  stores: '',
  ordering: '-rating',
};

export default function Publisher() {
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState<GameFilters>(INITIAL_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 400);
  const activeFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  const { data: publisher } = usePublisher(id ?? '');
  const { data, isLoading, isFetching, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePublisherGames(id ?? '', activeFilters);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isError) toast.error('Impossible de charger les jeux.');
  }, [isError]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const games: RawgGame[] = data?.pages.flatMap((p) => p.results) ?? [];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        {publisher ? publisher.name : 'Éditeur'}
      </h1>

      <FilterBar filters={filters} onChange={setFilters} />

      {isLoading && (
        <div className={styles.grid} aria-busy="true" aria-label="Chargement des jeux">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {!isLoading && !isFetching && !isError && games.length === 0 && (
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
```

- [ ] **Remplacer `Publisher.module.css`**

```css
.page {
  width: 100%;
}

.title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.skeleton {
  border-radius: 0.75rem;
  aspect-ratio: 3 / 4;
}

.empty {
  text-align: center;
  opacity: 0.6;
  padding: 4rem 0;
  font-size: 1.125rem;
}

.sentinel {
  height: 1px;
  margin-top: 2rem;
}

.loadingMore {
  text-align: center;
  padding: 1rem 0;
  opacity: 0.6;
}
```

---

## Task 7 : Favorites

**Fichiers :**
- Modifier : `src/pages/Favorites/Favorites.tsx`
- Modifier : `src/pages/Favorites/Favorites.module.css`

- [ ] **Remplacer `Favorites.tsx`**

```typescript
import { Heart } from 'lucide-react';
import { useFavorites } from '../../components/hooks/useFavorites';
import GameCard from '../../components/GameCard/GameCard';
import { Card, CardContent } from '@/components/ui/card';
import styles from './Favorites.module.css';

export default function Favorites() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className={styles.page}>
        <Card className={styles.emptyCard}>
          <CardContent className={styles.emptyContent}>
            <Heart size={48} className={styles.emptyIcon} aria-hidden="true" />
            <p className={styles.emptyTitle}>Aucun favori pour l'instant</p>
            <p className={styles.emptySubtitle}>
              Ajoute des jeux à tes favoris depuis la page d'accueil.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mes favoris ({favorites.length})</h1>
      <div className={styles.grid}>
        {favorites.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Remplacer `Favorites.module.css`**

```css
.page {
  width: 100%;
}

.title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.emptyCard {
  max-width: 400px;
  margin: 4rem auto;
}

.emptyContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem !important;
  text-align: center;
}

.emptyIcon {
  opacity: 0.3;
  color: var(--color-primary);
}

.emptyTitle {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.emptySubtitle {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.6;
}
```
