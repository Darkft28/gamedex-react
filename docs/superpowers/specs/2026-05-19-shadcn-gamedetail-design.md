# Design : shadcn/ui + GameDetail + Pages manquantes

**Date :** 2026-05-19
**Scope :** Refacto GameCard + FilterBar avec shadcn/ui, implémentation GameDetail, Publisher, Favorites

---

## Objectif

Maximiser l'usage de composants shadcn/ui (basés sur Radix UI) pour garantir accessibilité, cohérence et maintenabilité. Zéro composant UI écrit à la main là où shadcn couvre le besoin.

---

## Composants shadcn à installer

```bash
npx shadcn@latest add card input select badge skeleton button separator tabs scroll-area aspect-ratio
```

---

## 1. GameCard — refacto avec shadcn Card

**Fichiers :** `src/components/GameCard/GameCard.tsx`, `GameCard.module.css`

Remplacer la div custom par `Card` + `CardContent` de shadcn. Conserver :
- Image poster (aspect-ratio 3/4)
- Bouton favori `Heart` (Lucide) positionné en absolu sur l'image
- Nom du jeu (tronqué 2 lignes)
- Rating avec étoile
- Navigation vers `/games/:id`

Le `Card` shadcn sert de wrapper avec `hover:scale` via Tailwind. Le `CardContent` contient les infos bas de carte.

---

## 2. FilterBar — refacto avec shadcn Input + Select

**Fichiers :** `src/components/FilterBar/FilterBar.tsx`, `FilterBar.module.css`

- `<Input>` shadcn remplace `<input type="search">`
- `<Select>` shadcn (Radix) remplace les 3 `<select>` natifs
- La logique de filtres (`set`, `onChange`, `GameFilters`) reste identique
- Le conteneur `.bar` sticky reste en CSS module

---

## 3. GameDetail — nouvelle page

**Fichiers :** `src/pages/GameDetail/GameDetail.tsx`, `GameDetail.module.css`
**Hook existant :** `useGameDetail(id)`, `useGameTrailers(id)`, `useGameAchievements(id)`

### Sections

**Hero**
- Image de fond pleine largeur (`AspectRatio` shadcn ratio 16/9 ou image cover)
- Titre en overlay + rating ⭐
- `Button` shadcn "♥ Favori" (toggle via `useFavorites`)

**Méta**
- `Badge` shadcn pour chaque plateforme
- `Badge` outline pour chaque genre
- Lien éditeur → `/publisher/:id` (si disponible)
- Date de sortie

**Tabs (Description | Achievements)**
- `Tabs` shadcn avec 2 onglets :
  - **Description** : `description_raw` du jeu (texte long)
  - **Achievements** : `ScrollArea` shadcn listant les achievements (nom + description)

**Trailer**
- Si `useGameTrailers` retourne des résultats : `<video>` ou `<iframe>` avec l'URL du trailer
- Sinon : section masquée

**Loading state**
- `Skeleton` shadcn pour hero, badges, texte pendant le chargement

### Types à enrichir

Ajouter dans `src/types/rawg.ts` :
```typescript
export type RawgGameDetail = RawgGame & {
  description_raw: string;
  released: string | null;
  genres: Array<{ id: number; name: string; slug: string }>;
  publishers: Array<{ id: number; name: string; slug: string }>;
  developers: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  metacritic: number | null;
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
```

---

## 4. Publisher — page identique à Home

**Fichiers :** `src/pages/Publisher/Publisher.tsx`, `Publisher.module.css`

- Récupère `id` depuis `useParams()`
- Appelle `fetchPublisherGames(id, params)` via un nouveau hook `usePublisherGames`
- Réutilise **exactement** `FilterBar` + `GameCard` + grille infinite scroll de Home
- Ajoute un titre "Jeux de [publisher name]" en haut

**Nouveau hook :** `src/components/hooks/usePublisherGames.ts`
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

---

## 5. Favorites — page grille depuis localStorage

**Fichiers :** `src/pages/Favorites/Favorites.tsx`, `Favorites.module.css`

- `useFavorites()` retourne `favorites: RawgGame[]`
- Même grille CSS que Home (2→3→5 colonnes)
- Même `GameCard` pour chaque jeu
- État vide : `Card` shadcn centré avec icône `Heart` et texte "Aucun favori pour l'instant"
- Pas d'infinite scroll (données locales, pas d'API)

---

## Ordre d'implémentation

1. Installer les composants shadcn
2. Enrichir `src/types/rawg.ts`
3. Refacto `GameCard` avec shadcn Card
4. Refacto `FilterBar` avec shadcn Input + Select
5. Créer `usePublisherGames` hook
6. Implémenter `GameDetail`
7. Implémenter `Publisher`
8. Implémenter `Favorites`

---

## Contraintes projet

- Pas d'Axios, `fetch` natif uniquement
- Pas d'id 678
- CSS dans les modules, zéro style inline
- Clé API via `import.meta.env.VITE_RAWG_API_KEY`
- Publisher doit reprendre **exactement** le design de Home
- Favoris persistent dans localStorage
