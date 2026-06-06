import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import filterReducer from './slices/filterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    filters: filterReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type { RootState, AppDispatch } from './types';
