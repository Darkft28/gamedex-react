# Sujet d'évaluation – 2WEBD

## Contexte

Application d'exploration de la base de données RAWG. Recherche, filtres, tri, accessibilité, interface professionnelle.

**Axios est strictement interdit.**

---

## Pages

### `/` et `/games` — Liste des jeux

- Barre de filtres :
  - Recherche par nom
  - Filtre par plateforme (PC, Xbox, PlayStation, Nintendo…)
  - Filtre par store (Steam, Epic Games, Play Store…)
  - Tri par les options disponibles sur l'API
- Pagination ou infinite scroll
- Chaque jeu est cliquable vers sa page de détail

### `/games/{id}` — Détail d'un jeu

- Nom complet
- Description
- Trailer (si disponible)
- Plateformes disponibles
- Tags
- Studios et éditeurs
- Achievements / trophées / succès avec barre de progression (% de joueurs les ayant validés)

### `/publisher/{id}` — Jeux d'un éditeur

- Liste de tous les jeux de l'éditeur
- Reprend le design de la page d'accueil

### `/favorites` — Favoris

- Ajout/suppression de jeux en favoris
- Stockage via **Context** + stockage navigateur (localStorage ou sessionStorage)
- Persistance entre les sessions

### Page 404

- Page d'erreur avec lien de retour vers l'accueil

---

## Éléments obligatoires

- Utiliser l'**API RAWG**
- Utiliser **`fetch`** pour les appels HTTP (Axios interdit)
- **Isolation des classes CSS** (CSS Modules ou équivalent)
- Utiliser **`react-toastify`**
- Interface **responsive**
- Respect des normes d'**accessibilité numérique**
- Fichier **`.env.example`** fourni
- Clé API **jamais visible** dans le code source

---

## Tests (bonus)

Non obligatoires. Jusqu'à 10 points bonus pour des tests end-to-end avec **Playwright** :

- Recherche d'un jeu
- Accès à la page de détail
- Ajout aux favoris
- Persistance des favoris entre deux sessions
- Affichage de la page 404

Cypress n'est pas demandé.

---

## Rendu

- Archive **`.zip`** contenant tout le code
- **Sans** `node_modules` ni `.env`
- Clé API absente du code source

---

## Notation

| Critère | Points |
|---|---|
| Pages, fonctionnalités, liens fonctionnels | 25 |
| Qualité du code, architecture, factorisation, isolation | 20 |
| Gestion des données (Context + Storage) | 15 |
| Utilisation correcte de `fetch`, absence d'Axios | 10 |
| UI/UX | 10 |
| Accessibilité | 10 |
| Gestion des erreurs, états de chargement, cas limites | 10 |
| **Bonus** (Playwright, améliorations justifiées) | +10 |

## Malus

- Présence de `node_modules` ou `.env` dans le rendu
- Clé API visible dans le code source
- Utilisation d'Axios
- Librairies dépréciées
- Application non fonctionnelle
- Non-respect manifeste des consignes

> Selon la gravité, les malus peuvent aller jusqu'à l'ajournement du projet.
