import { RootState } from '../store';

// === User Slice ===
export const selectRegisterUserError = (state: RootState) =>
  state.user.registerUserError;
export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectAuthChecked = (state: RootState) => state.auth.isAuthChecked;
