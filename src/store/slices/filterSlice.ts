import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TaskStatus, TaskPriority } from '@/types/task.types';
import type { ProjectStatus } from '@/types/project.types';

interface FilterState {
  projectFilters: {
    status?: ProjectStatus;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
  };
  taskFilters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    search?: string;
    assigneeId?: string;
    deadlineStatus?: 'upcoming' | 'overdue';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
  };
}

const initialState: FilterState = {
  projectFilters: {},
  taskFilters: {},
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setProjectFilters: (state, { payload }: PayloadAction<Partial<FilterState['projectFilters']>>) => {
      state.projectFilters = { ...state.projectFilters, ...payload };
    },
    resetProjectFilters: state => {
      state.projectFilters = {};
    },
    setTaskFilters: (state, { payload }: PayloadAction<Partial<FilterState['taskFilters']>>) => {
      state.taskFilters = { ...state.taskFilters, ...payload };
    },
    resetTaskFilters: state => {
      state.taskFilters = {};
    },
  },
});

export const { setProjectFilters, resetProjectFilters, setTaskFilters, resetTaskFilters } = filterSlice.actions;
export default filterSlice.reducer;
