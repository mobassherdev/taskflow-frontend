import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type { User } from '@/types/auth.types';

export const usersApi = {
  getAll: (params?: { search?: string; role?: string }) =>
    apiClient.get<ApiResponse<{ users: User[]; pagination: any }>>('/users', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  update: (id: string, data: Partial<{ name: string; avatar: string }>) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/users/${id}`),
};
