import store from '../store';
import {
  createOrderThunk,
  getOrderByNumberThunk,
  getUserOrdersThunk,
  setOrders,
  setOrderModalData,
  clearOrderModalData
} from '../slices/order-slice';
import * as api from '@api';

jest.mock('@api');

describe('orderSlice integration tests', () => {
  const mockOrder = {
    _id: '1',
    status: 'done',
    name: 'Burger',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    number: 100,
    ingredients: ['1', '2']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create order successfully', async () => {
    (api.orderBurgerApi as jest.Mock).mockResolvedValue({ order: mockOrder });

    await store.dispatch(createOrderThunk(['1', '2']));

    const state = store.getState().order;
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.orderRequest).toBe(false);
  });

  it('should get order by number', async () => {
    (api.getOrderByNumberApi as jest.Mock).mockResolvedValue({ orders: [mockOrder] });

    await store.dispatch(getOrderByNumberThunk(100));

    const state = store.getState().order;
    expect(state.orderModalData).toEqual(mockOrder);
  });

  it('should get user orders history', async () => {
    (api.getOrdersApi as jest.Mock).mockResolvedValue([mockOrder]);

    await store.dispatch(getUserOrdersThunk());

    const state = store.getState().order;
    expect(state.ordersHistory).toEqual([mockOrder]);
  });

  it('should set and clear order modal data', () => {
    store.dispatch(setOrderModalData(mockOrder));
    expect(store.getState().order.orderModalData).toEqual(mockOrder);

    store.dispatch(clearOrderModalData());
    expect(store.getState().order.orderModalData).toBeNull();
  });

  it('should set orders manually', () => {
    store.dispatch(setOrders([mockOrder]));
    expect(store.getState().order.orders).toEqual([mockOrder]);
  });
});
