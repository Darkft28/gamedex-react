# Design — Page Home

## Objectif

Implémenter la page d'accueil (`/` et `/games`) : liste de jeux RAWG avec filtres, infinite scroll et gestion des favoris.

## FilterBar

Barre sticky sous la navbar, 4 contrôles en ligne (wrap sur mobile) :

- **Search** : input texte, debounce 400 ms, met à jour le paramètre `search`
- **Plateforme** : select alimenté par `/platforms`, paramètre `platforms`
- **Store** : select alimenté par `/stores`, paramètre `stores`
- **Tri** : select statique avec les options RAWG (`-rating`, `-released`, `name`, `-added`, `released`), paramètre `ordering`

Les filtres sont contrôlés dans `Home` via un état `filters` unique, passé à `FilterBar` via props.

## GameCard

Card poster vertical :
- Grande image de couverture (`background_image`) en format portrait
- Gradient overlay sombre en bas
- Nom du jeu + rating ⭐ sur l'overlay
- Icône cœur (Lucide `Heart`) en haut à droite : remplie si favori, vide sinon
- Clic sur le cœur → `addFavorite` / `removeFavorite` + `toast.success()`
- Clic sur la card → navigate vers `/games/:id`

## Infinite Scroll

- Hook `useInfiniteQuery` (@tanstack/react-query) dans `useGames`
- `getNextPageParam` = `next` de la réponse RAWG (URL page suivante)
- `IntersectionObserver` sur un `<div ref={sentinelRef}>` en bas de grille
- Quand le sentinel entre dans le viewport → `fetchNextPage()`

## Grille

CSS Grid responsive :
- Mobile (< 640px) : 2 colonnes
- Tablette (640–1024px) : 3 colonnes
- Desktop (> 1024px) : 5 colonnes

## États

| Situation | Rendu |
|---|---|
| Chargement initial | 10 skeleton cards (div grise animée) |
| Chargement page suivante | spinner centré sous la grille |
| Erreur API | `toast.error()`, message inline |
| Liste vide | Message centré "Aucun jeu trouvé" |
| Ajout/retrait favori | `toast.success()` |

## Fichiers modifiés

| Fichier | Rôle |
|---|---|
| `src/pages/Home/Home.tsx` | État `filters`, composition FilterBar + grille + sentinel |
| `src/pages/Home/Home.module.css` | Layout grille responsive |
| `src/components/FilterBar/FilterBar.tsx` | 4 contrôles, props `filters` + `onChange` |
| `src/components/FilterBar/FilterBar.module.css` | Barre flexible, sticky |
| `src/components/GameCard/GameCard.tsx` | Card poster, bouton favori |
| `src/components/GameCard/GameCard.module.css` | Image, overlay, hover |
| `src/components/hooks/useGames.ts` | Migration vers `useInfiniteQuery` |
