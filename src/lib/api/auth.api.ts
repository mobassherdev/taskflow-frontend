import apiClient from './client';
import type { LoginPayload, SignupPayload, AuthResponse } from '@/types/auth.types';
import type { ApiResponse } from '@/types/api.types';

export const authApi = {
  login: (data: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),

  signup: (data: SignupPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', data),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken }),

  me: () =>
    apiClient.get<ApiResponse<any>>('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { currentPassword, newPassword }),
};
