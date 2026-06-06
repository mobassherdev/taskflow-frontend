import type authReducer from './slices/authSlice';
import type uiReducer from './slices/uiSlice';
import type filterReducer from './slices/filterSlice';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

export type RootState = {
  auth: ReturnType<typeof authReducer>;
  ui: ReturnType<typeof uiReducer>;
  filters: ReturnType<typeof filterReducer>;
};

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
