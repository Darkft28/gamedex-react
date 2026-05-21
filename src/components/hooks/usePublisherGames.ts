import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPublisherGames } from '../services/rawgApi';
import { getNextPageParam } from './queryHelpers';
import type { GameFilters } from '../../types/rawg';

export function usePublisherGames(
  publisherId: string | undefined,
  filters: Partial<GameFilters>,
) {
  return useInfiniteQuery({
    queryKey: ['publisher-games', publisherId, filters],
    queryFn: ({ pageParam }) =>
      fetchPublisherGames(publisherId ?? '', { ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!publisherId,
  });
}
