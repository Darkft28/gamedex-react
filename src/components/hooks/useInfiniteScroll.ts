import { useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * Gère l'infinite scroll via IntersectionObserver et affiche un toast en cas d'erreur.
 * L'observer n'est créé qu'une fois (fetchNextPage est stable par TanStack Query).
 * hasNextPage et isFetchingNextPage sont lus via refs pour ne pas déclencher de
 * re-création de l'observer à chaque chargement de page.
 */
export function useInfiniteScroll(
  fetchNextPage: () => unknown,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  isError: boolean,
) {
  const sentinelRef = useRef<HTMLDivElement>(null);
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
