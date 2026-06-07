import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type { User, SignupPayload } from '@/types/auth.types';

export const usersApi = {
  getAll: (params?: { search?: string; role?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<{ users: User[]; pagination: any }>>('/users', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  create: (data: SignupPayload) =>
    apiClient.post<ApiResponse<{ user: User }>>('/auth/signup', data),

  update: (id: string, data: Partial<{ name: string; avatar: string }>) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/users/${id}`),
};
