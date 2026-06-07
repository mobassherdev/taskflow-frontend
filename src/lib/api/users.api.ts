import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type { User, SignupPayload, Role } from '@/types/auth.types';

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: Role;
  avatar?: string;
  password?: string;
}

export const usersApi = {
  getAll: (params?: { search?: string; role?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<{ users: User[]; pagination: any }>>('/users', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  create: (data: SignupPayload) =>
    apiClient.post<ApiResponse<{ user: User }>>('/auth/signup', data),

  update: (id: string, data: UpdateUserPayload) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/users/${id}`),
};
