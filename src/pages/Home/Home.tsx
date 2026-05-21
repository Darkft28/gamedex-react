import { useMemo } from 'react';
import { useGames } from '../../components/hooks/useGames';
import { useGameListState } from '../../components/hooks/useGameListState';
import { useInfiniteScroll } from '../../components/hooks/useInfiniteScroll';
import GameListView from '../../components/GameListView/GameListView';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import type { RawgGame } from '../../types/rawg';

export default function Home() {
  const { filters, setFilters, activeFilters } = useGameListState();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGames(activeFilters);
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, isError);
  const games = useMemo<RawgGame[]>(() => data?.pages.flatMap((p) => p.results) ?? [], [data]);
  const heroGames = useMemo(() => games.slice(0, 8), [games]);

  return (
    <GameListView
      hero={heroGames.length > 0 ? <HeroCarousel games={heroGames} /> : undefined}
      games={games}
      isLoading={isLoading}
      isError={isError}
      isFetchingNextPage={isFetchingNextPage}
      sentinelRef={sentinelRef}
      filters={filters}
      setFilters={setFilters}
    />
  );
}
