import { RootState } from '../store';

// === Auth Slice ===
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.isError;
export const selectIsAuthChecked = (state: RootState) =>
  state.auth.isAuthChecked;
