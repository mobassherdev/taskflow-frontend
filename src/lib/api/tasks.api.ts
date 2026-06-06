import apiClient from './client';
import type { Task, CreateTaskPayload, TaskFilters } from '@/types/task.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const tasksApi = {
  getByProject: (projectId: string, params?: TaskFilters) =>
    apiClient.get<ApiResponse<PaginatedResponse<Task>>>(
      `/projects/${projectId}/tasks`, { params }
    ),

  getById: (projectId: string, taskId: string) =>
    apiClient.get<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}`),

  create: (projectId: string, data: CreateTaskPayload) =>
    apiClient.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, data),

  update: (projectId: string, taskId: string, data: Partial<CreateTaskPayload>) =>
    apiClient.patch<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}`, data),

  delete: (projectId: string, taskId: string) =>
    apiClient.delete(`/projects/${projectId}/tasks/${taskId}`),

  addComment: (projectId: string, taskId: string, body: string) =>
    apiClient.post(`/projects/${projectId}/tasks/${taskId}/comments`, { body }),

  uploadAttachment: (projectId: string, taskId: string, file: FormData) =>
    apiClient.post(
      `/projects/${projectId}/tasks/${taskId}/attachments`,
      file,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),

  getMyTasks: (params?: TaskFilters) =>
    apiClient.get<ApiResponse<PaginatedResponse<Task>>>('/my-tasks', { params }),
};
