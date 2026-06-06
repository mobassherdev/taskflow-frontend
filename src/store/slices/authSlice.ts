import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginPayload, SignupPayload, AuthResponse, User } from '@/types/auth.types';

const STORAGE_KEY = 'taskflow_auth';

function loadFromStorage(): Partial<AuthState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(state: Partial<AuthState>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  }));
  // Set cookie so middleware knows user is authenticated
  document.cookie = 'tf_session=1; path=/; max-age=2592000';
}

function clearSessionCookie() {
  if (typeof window === 'undefined') return;
  document.cookie = 'tf_session=; path=/; max-age=0';
}

const persisted = loadFromStorage();

// Sync cookie on app load if user was already logged in
if (persisted.accessToken && typeof window !== 'undefined') {
  document.cookie = 'tf_session=1; path=/; max-age=2592000';
}

const initialState: AuthState = {
  user: persisted.user ?? null,
  accessToken: persisted.accessToken ?? null,
  refreshToken: persisted.refreshToken ?? null,
  isAuthenticated: !!persisted.accessToken,
  isLoading: false,
};

export const loginThunk = createAsyncThunk<AuthResponse, LoginPayload>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { authApi } = await import('@/lib/api/auth.api');
      const { data } = await authApi.login(payload);
      return data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Login failed');
    }
  },
);

export const signupThunk = createAsyncThunk<AuthResponse, SignupPayload>(
  'auth/signup',
  async (payload, { rejectWithValue }) => {
    try {
      const { authApi } = await import('@/lib/api/auth.api');
      const { data } = await authApi.signup(payload);
      return data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Signup failed');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
      clearSessionCookie();
    },
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      saveToStorage(state);
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveToStorage(state);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => { state.isLoading = true; })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.isAuthenticated = true;
        saveToStorage(state);
      })
      .addCase(loginThunk.rejected, state => { state.isLoading = false; })
      .addCase(signupThunk.pending, state => { state.isLoading = true; })
      .addCase(signupThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.isAuthenticated = true;
        saveToStorage(state);
      })
      .addCase(signupThunk.rejected, state => { state.isLoading = false; });
  },
});

export const { logout, setTokens, updateUser } = authSlice.actions;
export default authSlice.reducer;
