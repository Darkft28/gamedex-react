import type { RawgPaginated } from '../../types/rawg';

/**
 * Stratégie de pagination partagée pour tous les useInfiniteQuery RAWG.
 * Retourne le numéro de la prochaine page tant que l'API signale qu'il en existe une.
 */
export function getNextPageParam<T>(
  lastPage: RawgPaginated<T>,
  allPages: unknown[],
): number | undefined {
  return lastPage.next ? allPages.length + 1 : undefined;
}
