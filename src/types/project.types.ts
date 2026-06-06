export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';

export interface Project {
  id: string;
  name: string;
  description?: string;
  deadline?: string;
  status: ProjectStatus;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  members?: ProjectMember[];
  _count?: {
    tasks: number;
    members: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  deadline?: string;
  status?: ProjectStatus;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
  sortBy?: 'createdAt' | 'deadline' | 'name' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
