import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchGames } from '../services/rawgApi';
import { getNextPageParam } from './queryHelpers';
import type { GameFilters } from '../../types/rawg';

export function useGames(filters: Partial<GameFilters>) {
  return useInfiniteQuery({
    queryKey: ['games', filters],
    queryFn: ({ pageParam }) =>
      fetchGames({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
  });
}
