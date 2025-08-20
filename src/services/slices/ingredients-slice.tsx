import { TIngredient } from '@utils-types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

export type TIngrediendSlice = {
  ingredients: TIngredient[];
  ingredientsRequest: boolean;
  IngredientsError: string | null;
};

export const initialState: TIngrediendSlice = {
  ingredients: [],
  ingredientsRequest: false,
  IngredientsError: null
};

export const getIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => await getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.ingredientsRequest = true;
        state.IngredientsError = null;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.ingredientsRequest = false;
        state.IngredientsError = 'Ошибка загрузки ингредиентов';
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredientsRequest = false;
          state.IngredientsError = null;
          state.ingredients = action.payload;
        }
      );
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
