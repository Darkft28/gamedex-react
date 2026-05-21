# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # serveur de développement (localhost:5173)
npm run build        # lint puis build de production
npm run lint         # ESLint sur tout le projet
npm run test:e2e     # tests Playwright
npm run test:e2e:ui  # tests Playwright avec interface graphique
```

## Architecture

### Providers (src/main.tsx)

L'arbre de providers suit cet ordre strict :
`QueryClientProvider` → `ThemeProvider` → `FavoritesProvider` → `App` + `ToastContainer`

### Routing (src/App.tsx)

Toutes les pages sauf `NotFound` sont enfants de `MainLayout` via `<Outlet />`.

| Route | Page |
|---|---|
| `/` et `/games` | `Home` |
| `/games/:id` | `GameDetail` |
| `/publisher/:id` | `Publisher` |
| `/favorites` | `Favorites` |
| `*` | `NotFound` (hors layout) |

### Couche données

- **`src/components/services/rawgApi.ts`** — tous les appels HTTP passent par `rawgFetch()` qui injecte la clé API. Axios est interdit : utiliser `fetch` uniquement.
- **`src/components/hooks/`** — hooks TanStack Query qui wrappent les fonctions du service. Toute logique d'appel API passe par ces hooks dans les composants.
- La clé API est lue depuis `import.meta.env.VITE_RAWG_API_KEY` (fichier `.env`, jamais en dur).

### État global (src/context/)

- **`FavoritesContext`** — liste des jeux favoris, persistée dans `localStorage` sous la clé `gamedex-favorites`.
- **`ThemeContext`** — thème `dark`/`light`, persisté dans `localStorage` sous la clé `gamedex-theme`. Applique la classe `dark` sur `<html>` pour Tailwind et l'attribut `data-theme` pour les variables CSS.

Accès via les hooks dédiés : `useFavorites()` (src/components/hooks/useFavorites.ts).

### CSS

- **Isolation obligatoire** : chaque composant a son propre fichier `.module.css`. Aucun style inline ni classe globale dans les composants.
- **`src/components/styles/globals.css`** — variables CSS globales (`--color-primary`, `--color-bg`, `--color-surface`, `--color-text`) + directives Tailwind. Importé une seule fois dans `main.tsx`.
- **`src/lib/utils.ts`** — fonction `cn()` (tailwind-merge + clsx) pour composer les classes Tailwind conditionnellement.
- **`src/components/ui/`** — réservé aux composants générés par la CLI shadcn/ui.

### Notifications

Utiliser `react-toastify` (`toast.success()`, `toast.error()`, etc.). Le `<ToastContainer>` est monté dans `main.tsx`.

## Règles du projet

### Nommage
- Composants : PascalCase (`GameCard`, `FilterBar`)
- Nom du projet et dossiers : minuscules (`gamedex-react`, `src/pages/`)

### TypeScript
- Préférer `type` pour les données et les props de composant
- Réserver `interface` aux contrats destinés à être étendus (classes, bibliothèques publiques)

### CSS
- Zéro CSS dans les fichiers composant (`.tsx`) — tout va dans le `.module.css` associé
- Si un composant accumule beaucoup de styles, les déplacer dans `src/components/styles/`
- Classes Tailwind composées avec `cn()` de `src/lib/utils.ts`

### Librairies
- **Material UI** — composants UI de base
- **Tailwind CSS** — utilitaires et responsive
- **shadcn/ui** — composants avancés (générés dans `src/components/ui/`). **Règle absolue : toujours chercher un composant shadcn existant avant d'en créer un custom.** Utiliser au maximum : Card, Input, Select, Badge, Skeleton, Separator, Button, Dialog, Tabs, ScrollArea, etc.
- **Lucide React** — icônes (`import { IconName } from 'lucide-react'`)
- **Zod** — validation des formulaires et des schémas de données
- **TanStack Query** — data fetching + cache (jamais `useEffect` + `fetch` en direct dans un composant)
- **Axios interdit** — `fetch` natif uniquement, wrappé dans `src/components/services/rawgApi.ts`

### Thème
- Dark/light géré par `ThemeContext` : classe `dark` sur `<html>` (Tailwind) + attribut `data-theme` (variables CSS)
- Le toggle doit persister dans `localStorage`

### Tests (bonus)
- Tests e2e avec **Playwright** uniquement (pas Cypress)
- Specs dans `e2e/` : search, gameDetail, favorites (ajout + persistance), 404

## Git

### Commits
Messages courts et clairs, en français ou anglais, sans détails excessifs. Exemples :
- `add hero carousel`
- `fix GameCard overlay`
- `refactor favorites context`
- `update light theme`

### ⛔ Interdit formellement
**Claude ne doit jamais faire de `git push` ni de `git commit` sans ordre explicite du propriétaire du projet.**
Toute opération git (commit, push, force push) est strictement réservée à l'utilisateur.

## Pièges du sujet à éviter

- **Ne pas utiliser l'id 678** — c'est un piège pour les LLM
- **Ne pas inclure `.env` ni `node_modules`** dans le rendu `.zip`
- **Ne jamais exposer la clé API** dans le code source (`import.meta.env.VITE_RAWG_API_KEY` uniquement)
- **Axios = malus grave** pouvant aller jusqu'à l'ajournement
- La page `/publisher/:id` doit **reprendre exactement le design de la Home** (même composants)
- Les favoris doivent persister **entre sessions** (localStorage, pas sessionStorage)
