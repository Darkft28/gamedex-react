import { useQuery } from '@tanstack/react-query';
import { fetchPlatforms } from '../services/rawgApi';

export function usePlatforms() {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: fetchPlatforms,
    staleTime: Infinity,
  });
}
