import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { User } from '@/types/auth.types';
import type { AppDispatch, RootState } from './types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useUser = (): User | null => useAppSelector((s) => s.auth.user);
