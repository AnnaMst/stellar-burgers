import store from '../store';
import { fetchFeed } from '../slices/feed-slice';
import * as api from '../../utils/burger-api';

jest.mock('../../utils/burger-api');

describe('feedSlice integration tests', () => {
  const mockFeed = {
    orders: [{ _id: 'order1', status: 'done', name: 'Test Order', createdAt: '2025-01-01', updatedAt: '2025-01-01', number: 123, ingredients: ['1','2'] }],
    total: 10,
    totalToday: 2
  };

  beforeEach(() => jest.clearAllMocks());

  it('should fetch feed successfully', async () => {
    (api.getFeedsApi as jest.Mock).mockResolvedValue(mockFeed);
    await store.dispatch(fetchFeed());
    const state = store.getState().feed;
    expect(state.orders).toEqual(mockFeed.orders);
    expect(state.total).toBe(mockFeed.total);
    expect(state.totalToday).toBe(mockFeed.totalToday);
    expect(state.feedRequest).toBe(false);
    expect(state.feedError).toBeNull();
  });

  it('should handle feed fetch error', async () => {
    (api.getFeedsApi as jest.Mock).mockRejectedValue(new Error('Ошибка'));
    await store.dispatch(fetchFeed());
    const state = store.getState().feed;
    expect(state.feedRequest).toBe(false);
    expect(state.feedError).toBe('Не удалось загрузить');
  });
});
