import store from '../store';

describe('rootReducer integration test', () => {
  it('should return initial state for all slices', () => {
    const state = store.getState();

    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');

    // Проверяем, что начальное состояние соответствует ожидаемому
    expect(state.burgerConstructor).toEqual({ bun: null, ingredients: [] });
    expect(state.ingredients.ingredients).toEqual([]);
    expect(state.ingredients.ingredientsRequest).toBe(false);
    expect(state.feed.orders).toEqual([]);
    expect(state.user.user).toBeNull();
  });
});
