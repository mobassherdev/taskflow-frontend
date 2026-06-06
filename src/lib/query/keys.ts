export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  projects: {
    all: (filters?: object) => ['projects', filters] as const,
    detail: (id: string) => ['projects', id] as const,
    members: (id: string) => ['projects', id, 'members'] as const,
  },
  tasks: {
    byProject: (projectId: string, filters?: object) =>
      ['tasks', projectId, filters] as const,
    detail: (projectId: string, taskId: string) =>
      ['tasks', projectId, taskId] as const,
    myTasks: (filters?: object) => ['tasks', 'my', filters] as const,
  },
  analytics: {
    dashboard: ['analytics', 'dashboard'] as const,
    projectProgress: (id: string) => ['analytics', 'project', id] as const,
  },
  activities: {
    recent: ['activities'] as const,
  },
  notifications: {
    all: (page?: number) => ['notifications', page] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  },
};
