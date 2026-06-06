export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityName?: string;
  description: string;
  createdAt: string;
  actor: { id: string; name: string; avatar?: string };
  projectId?: string;
}
