import { useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

export function useInfiniteScroll(
  fetchNextPage: () => unknown,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  isError: boolean,
) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  // Refs pour lire les valeurs courantes dans le callback sans recréer l'observer
  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);

  useEffect(() => { hasNextPageRef.current = hasNextPage; }, [hasNextPage]);
  useEffect(() => { isFetchingNextPageRef.current = isFetchingNextPage; }, [isFetchingNextPage]);

  useEffect(() => {
    if (isError) toast.error('Impossible de charger les jeux.');
  }, [isError]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasNextPageRef.current &&
          !isFetchingNextPageRef.current
        ) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
    // fetchNextPage est stable (TanStack Query le garantit)
  }, [fetchNextPage]);

  return sentinelRef;
}
