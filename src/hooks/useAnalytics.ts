'use client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { analyticsApi } from '@/lib/api/analytics.api';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard,
    queryFn: () => analyticsApi.getDashboard().then(r => r.data.data),
    staleTime: 60_000,
  });
}

export function useProjectProgress(id: string) {
  return useQuery({
    queryKey: queryKeys.analytics.projectProgress(id),
    queryFn: () => analyticsApi.getProjectProgress(id).then(r => r.data.data),
    enabled: !!id,
  });
}
