import store from '../store';
import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun,
  clearConstructor
} from '../slices/constructor-slice';

describe('constructorSlice integration tests', () => {
  const baseIngredient = {
    _id: '1',
    name: 'Test Ingredient',
    type: 'main',
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
    store.dispatch(clearConstructor());
  });

  it('should set bun', () => {
    store.dispatch(setBun({ ...baseIngredient, type: 'bun', id: 'bun1' }));
    expect(store.getState().burgerConstructor.bun?.name).toBe('Test Ingredient');
  });

  it('should add ingredient', () => {
    store.dispatch(addIngredient(baseIngredient));
    expect(store.getState().burgerConstructor.ingredients.length).toBe(1);
  });

  it('should remove ingredient', () => {
    store.dispatch(addIngredient(baseIngredient));
    const id = store.getState().burgerConstructor.ingredients[0].id;
    store.dispatch(removeIngredient(id));
    expect(store.getState().burgerConstructor.ingredients).toHaveLength(0);
  });

  it('should move ingredient', () => {
    store.dispatch(addIngredient({ ...baseIngredient, _id: '2', name: 'First' }));
    store.dispatch(addIngredient({ ...baseIngredient, _id: '3', name: 'Second' }));

    store.dispatch(moveIngredient({ fromIndex: 0, toIndex: 1 }));

    const names = store.getState().burgerConstructor.ingredients.map(i => i.name);
    expect(names).toEqual(['Second', 'First']);
  });

  it('should clear constructor', () => {
    store.dispatch(addIngredient(baseIngredient));
    store.dispatch(setBun({ ...baseIngredient, type: 'bun', id: 'bun2' }));
    store.dispatch(clearConstructor());

    const state = store.getState().burgerConstructor;
    expect(state.ingredients).toHaveLength(0);
    expect(state.bun).toBeNull();
  });
});
