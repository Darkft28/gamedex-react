import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from '../services/rawgApi';

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: Infinity,
  });
}
