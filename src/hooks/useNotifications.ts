'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, type Notification } from '@/lib/api/notifications.api';
import { toast } from 'sonner';

export function useNotifications(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: () => notificationsApi.getAll({ page, limit }).then(r => {
      const raw = r.data.data as any;
      return { data: raw.notifications ?? raw.data ?? [], pagination: raw.pagination };
    }),
    staleTime: 10_000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount().then(r => r.data.data),
    staleTime: 10_000,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });
}
