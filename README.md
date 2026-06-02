# GameDex React

Application d'exploration de jeux vidéo construite avec React et l'API [RAWG](https://rawg.io/apidocs).

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- Une clé API RAWG gratuite : [rawg.io/apidocs](https://rawg.io/apidocs)

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Darkft28/gamedex-react.git
cd gamedex-react

# 2. Installer les dépendances
npm install

# 3. Configurer la clé API
cp .env.example .env
# Ouvrir .env et remplacer la valeur par ta clé RAWG
```

Contenu du `.env` :

```env
VITE_RAWG_API_KEY=ta_clé_api_ici
```

## Lancer l'application

```bash
npm run dev
```

L'application est disponible sur [http://localhost:5173](http://localhost:5173).

## Build de production

```bash
npm run build
```

Le build est généré dans le dossier `dist/`. Pour le prévisualiser :

```bash
npm run preview
```

## Tests end-to-end (Playwright)

```bash
# Installer les navigateurs Playwright (première fois uniquement)
npx playwright install

# Lancer les tests
npm run test:e2e

# Lancer les tests avec l'interface graphique
npm run test:e2e:ui
```

> Les tests nécessitent que l'application tourne en parallèle (`npm run dev`), ou que le `baseURL` dans `playwright.config.ts` pointe vers un serveur démarré.

## Lint

```bash
npm run lint
```

## Pages

| Route | Description |
|---|---|
| `/` ou `/games` | Liste des jeux avec recherche, filtres et infinite scroll |
| `/games/:id` | Détail d'un jeu (description, trailer, achievements, screenshots, série) |
| `/publisher/:id` | Liste des jeux d'un éditeur |
| `/favorites` | Jeux mis en favoris (persistés dans le localStorage) |
| `*` | Page 404 |

## Stack technique

- **React 18** + **TypeScript**
- **Vite** — bundler et serveur de développement
- **TanStack Query** — data fetching et cache
- **React Router v6** — routing
- **Tailwind CSS** + **CSS Modules** — styles
- **shadcn/ui** + **Material UI** — composants UI
- **Lucide React** — icônes
- **react-toastify** — notifications
- **Playwright** — tests end-to-end
