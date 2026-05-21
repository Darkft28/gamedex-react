import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePublisher } from '../../components/hooks/usePublisher';
import { usePublisherGames } from '../../components/hooks/usePublisherGames';
import { useGameListState } from '../../components/hooks/useGameListState';
import { useInfiniteScroll } from '../../components/hooks/useInfiniteScroll';
import GameListView from '../../components/GameListView/GameListView';
import type { RawgGame } from '../../types/rawg';

export default function Publisher() {
  const { id } = useParams<{ id: string }>();
  const { filters, setFilters, activeFilters } = useGameListState();
  const { data: publisher } = usePublisher(id);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePublisherGames(id, activeFilters);
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, isError);
  const games = useMemo<RawgGame[]>(() => data?.pages.flatMap((p) => p.results) ?? [], [data]);

  return (
    <GameListView
      title={publisher?.name ?? 'Éditeur'}
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
