import { useQuery } from '@tanstack/react-query';
import { fetchStores } from '../services/rawgApi';

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores,
    staleTime: Infinity,
  });
}
