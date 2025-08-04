import { RootState } from '../store';

// === User Slice ===
export const selectRegisterUserError = (state: RootState) =>
  state.user.registerUserError;
export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const selectAuthLoading = (state: RootState) => state.user.isLoading;
export const selectAuthError = (state: RootState) => state.user.registerUserError;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

