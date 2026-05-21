export type RawgGame = {
  id: number;
  name: string;
  background_image: string | null;
  rating: number;
  platforms: Array<{ platform: { id: number; name: string; slug: string } }> | null;
};

export type RawgPlatform = {
  id: number;
  name: string;
  slug: string;
};

export type RawgStore = {
  id: number;
  name: string;
  slug: string;
};

export type RawgPaginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type GameFilters = {
  search: string;
  platforms: string;
  stores: string;
  ordering: string;
};

export const INITIAL_FILTERS: GameFilters = {
  search: '',
  platforms: '',
  stores: '',
  ordering: '-rating',
};

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
