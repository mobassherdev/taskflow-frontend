import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  entityId?: string;
  entityType?: string;
}

export const notificationsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications', { params }),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),

  markAsRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.patch('/notifications/read-all'),
};
