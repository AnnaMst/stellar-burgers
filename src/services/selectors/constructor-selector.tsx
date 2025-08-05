import { RootState } from '../store';

// === Constructor Slice ===
export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;
