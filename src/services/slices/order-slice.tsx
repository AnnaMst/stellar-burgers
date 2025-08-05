import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderState = {
  orders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
  ordersHistoryRequest: boolean;
  ordersHistory: TOrder[];
};

const initialState: TOrderState = {
  orders: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  ordersHistoryRequest: false,
  ordersHistory: []
};

export const createOrderThunk = createAsyncThunk<TOrder, string[]>(
  'order/create',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка оформления заказа');
    }
  }
);

export const getOrderByNumberThunk = createAsyncThunk<TOrder, number>(
  'order/getByNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      return response.orders[0];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка получения заказа');
    }
  }
);

export const getUserOrdersThunk = createAsyncThunk<TOrder[], void>(
  'order/getUserOrdersHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Ошибка получения истории заказов'
      );
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<TOrder[]>) {
      state.orders = action.payload;
    },
    setOrderRequest(state, action: PayloadAction<boolean>) {
      state.orderRequest = action.payload;
    },
    setOrderModalData(state, action: PayloadAction<TOrder | null>) {
      state.orderModalData = action.payload;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    // Создание заказа
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(
        createOrderThunk.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
        }
      )
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload as string;
      })

      // Получение заказа по номеру
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
        state.orderModalData = null;
      })
      .addCase(
        getOrderByNumberThunk.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
        }
      )
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload as string;
      })

      // Выгрузка истории заказов
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.ordersHistoryRequest = true;
        state.orderError = null;
      })
      .addCase(
        getUserOrdersThunk.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.ordersHistoryRequest = false;
          state.ordersHistory = action.payload;
        }
      )
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload as string;
      });
  }
});

export const {
  setOrders,
  setOrderRequest,
  setOrderModalData,
  clearOrderModalData
} = orderSlice.actions;

export default orderSlice.reducer;
