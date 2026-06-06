import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type { ActivityLog } from '@/types/api.types';

export const activityApi = {
  getRecent: () =>
    apiClient.get<ApiResponse<ActivityLog[]>>('/activities'),
};
