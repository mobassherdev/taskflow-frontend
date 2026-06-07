'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { tasksApi } from '@/lib/api/tasks.api';
import type { CreateTaskPayload, TaskFilters } from '@/types/task.types';
import { toast } from 'sonner';

export function useTasks(projectId: string, filters?: TaskFilters) {
  return useQuery({
    queryKey: queryKeys.tasks.byProject(projectId, filters),
    queryFn: () => tasksApi.getByProject(projectId, filters).then(r => {
      const raw = r.data.data as any;
      return { data: raw.tasks ?? raw.data ?? [], pagination: raw.pagination };
    }),
    enabled: !!projectId,
    staleTime: 20_000,
  });
}

export function useMyTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: queryKeys.tasks.myTasks(filters),
    queryFn: () => tasksApi.getMyTasks(filters).then(r => {
      const raw = r.data.data as any;
      return { data: raw.tasks ?? raw.data ?? [], pagination: raw.pagination };
    }),
    staleTime: 20_000,
  });
}

export function useTask(projectId: string, taskId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(projectId, taskId),
    queryFn: () => tasksApi.getById(projectId, taskId).then(r => r.data.data),
    enabled: !!(projectId && taskId),
  });
}

export function useCreateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskPayload) => tasksApi.create(projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      qc.invalidateQueries({ queryKey: ['tasks', 'my'] });
      qc.invalidateQueries({ queryKey: queryKeys.analytics.dashboard });
      toast.success('Task created');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Failed to create task');
    },
  });
}

export function useUpdateTask(projectId: string, taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateTaskPayload>) =>
      tasksApi.update(projectId, taskId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      qc.invalidateQueries({ queryKey: queryKeys.tasks.detail(projectId, taskId) });
      qc.invalidateQueries({ queryKey: ['tasks', 'my'] });
      qc.invalidateQueries({ queryKey: queryKeys.analytics.dashboard });
      toast.success('Task updated');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Failed to update task');
    },
  });
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.delete(projectId, taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      qc.invalidateQueries({ queryKey: ['tasks', 'my'] });
      qc.invalidateQueries({ queryKey: queryKeys.analytics.dashboard });
      toast.success('Task deleted');
    },
  });
}

export function useAddComment(projectId: string, taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => tasksApi.addComment(projectId, taskId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.detail(projectId, taskId) });
      qc.invalidateQueries({ queryKey: queryKeys.analytics.dashboard });
      qc.invalidateQueries({ queryKey: queryKeys.activities.recent });
      toast.success('Comment added');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Failed to add comment');
    },
  });
}
