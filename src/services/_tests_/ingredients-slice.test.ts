import store from '../store';
import { getIngredients } from '../slices/ingredients-slice';
import * as api from '@api';

jest.mock('@api');

describe('ingredientsSlice integration tests', () => {
  const mockIngredient = {
    _id: '1',
    name: 'Bun',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 50,
    image: 'img.png',
    image_large: 'img_large.png',
    image_mobile: 'img_mobile.png'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load ingredients successfully', async () => {
    (api.getIngredientsApi as jest.Mock).mockResolvedValue([mockIngredient]);

    await store.dispatch(getIngredients());

    const state = store.getState().ingredients;
    expect(state.ingredients).toEqual([mockIngredient]);
    expect(state.ingredientsRequest).toBe(false);
    expect(state.IngredientsError).toBeNull();
  });

  it('should handle error when loading ingredients', async () => {
    (api.getIngredientsApi as jest.Mock).mockRejectedValue(new Error('Ошибка'));

    await store.dispatch(getIngredients());

    const state = store.getState().ingredients;
    expect(state.ingredientsRequest).toBe(false);
    expect(state.IngredientsError).toBe('Ошибка загрузки ингредиентов');
  });
});
