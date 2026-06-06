import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark' | 'system';

interface UiState {
  sidebarOpen: boolean;
  theme: Theme;
  activeProjectId: string | null;
}

const initialState: UiState = {
  sidebarOpen: true,
  theme: (typeof window !== 'undefined'
    ? (localStorage.getItem('theme') as Theme) : null) ?? 'system',
  activeProjectId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.sidebarOpen = payload;
    },
    setTheme: (state, { payload }: PayloadAction<Theme>) => {
      state.theme = payload;
      if (typeof window !== 'undefined') localStorage.setItem('theme', payload);
    },
    setActiveProject: (state, { payload }: PayloadAction<string | null>) => {
      state.activeProjectId = payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme, setActiveProject } = uiSlice.actions;
export default uiSlice.reducer;
