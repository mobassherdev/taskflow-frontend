import apiClient from './client';
import type { Project, CreateProjectPayload, ProjectFilters } from '@/types/project.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const projectsApi = {
  getAll: (params?: ProjectFilters) =>
    apiClient.get<ApiResponse<PaginatedResponse<Project>>>('/projects', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Project>>(`/projects/${id}`),

  create: (data: CreateProjectPayload) =>
    apiClient.post<ApiResponse<Project>>('/projects', data),

  update: (id: string, data: Partial<CreateProjectPayload>) =>
    apiClient.patch<ApiResponse<Project>>(`/projects/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/projects/${id}`),

  addMember: (projectId: string, userId: string) =>
    apiClient.post(`/projects/${projectId}/members`, { userId }),

  removeMember: (projectId: string, userId: string) =>
    apiClient.delete(`/projects/${projectId}/members/${userId}`),
};
