import { useQuery } from '@tanstack/react-query';
import { fetchGameDetail, fetchGameAchievements, fetchGameTrailers, fetchGameScreenshots, fetchGameSeries } from '../services/rawgApi';

export function useGameDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['game', id],
    queryFn: () => fetchGameDetail(id ?? ''),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGameAchievements(id: string | undefined) {
  return useQuery({
    queryKey: ['game-achievements', id],
    queryFn: () => fetchGameAchievements(id ?? ''),
    enabled: !!id,
    staleTime: Infinity,
  });
}

export function useGameTrailers(id: string | undefined) {
  return useQuery({
    queryKey: ['game-trailers', id],
    queryFn: () => fetchGameTrailers(id ?? ''),
    enabled: !!id,
    staleTime: Infinity,
  });
}

export function useGameScreenshots(id: string | undefined) {
  return useQuery({
    queryKey: ['game-screenshots', id],
    queryFn: () => fetchGameScreenshots(id ?? ''),
    enabled: !!id,
    staleTime: Infinity,
  });
}

export function useGameSeries(id: string | undefined) {
  return useQuery({
    queryKey: ['game-series', id],
    queryFn: () => fetchGameSeries(id ?? ''),
    enabled: !!id,
    staleTime: Infinity,
  });
}
