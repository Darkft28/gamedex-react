import { useQuery } from '@tanstack/react-query';
import { fetchPublisher } from '../services/rawgApi';

export function usePublisher(id: string | undefined) {
  return useQuery({
    queryKey: ['publisher', id],
    queryFn: () => fetchPublisher(id ?? ''),
    enabled: !!id,
    staleTime: Infinity,
  });
}
