import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';

export const analyticsApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<any>>('/analytics/dashboard'),

  getProjectProgress: (id: string) =>
    apiClient.get<ApiResponse<any>>(`/analytics/projects/${id}/progress`),
};
