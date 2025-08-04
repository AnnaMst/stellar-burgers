import { RootState } from '../store';

// === Ingredients Slice ===
export const selectIngredients = (state: RootState) => state.ingredients;
export const selectIngredientsItems = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsRequest = (state: RootState) =>
  state.ingredients.ingredientsRequest;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.IngredientsError;
