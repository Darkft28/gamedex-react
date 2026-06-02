import type { RawgGame, RawgGameDetail, RawgPlatform, RawgStore, RawgPaginated, RawgAchievement, RawgTrailer, RawgPublisher, RawgGenre, RawgScreenshot } from '../../types/rawg';

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
  rawgFetch<RawgPaginated<RawgPlatform>>('/platforms', { page_size: 40 });
export const fetchStores = () =>
  rawgFetch<RawgPaginated<RawgStore>>('/stores', { page_size: 40 });
export const fetchPublisher = (id: number | string) =>
  rawgFetch<RawgPublisher>(`/publishers/${id}`);
export const fetchGenres = () =>
  rawgFetch<RawgPaginated<RawgGenre>>('/genres', { page_size: 40 });
export const fetchGameScreenshots = (id: number | string) =>
  rawgFetch<RawgPaginated<RawgScreenshot>>(`/games/${id}/screenshots`);
export const fetchGameSeries = (id: number | string) =>
  rawgFetch<RawgPaginated<RawgGame>>(`/games/${id}/game-series`);
