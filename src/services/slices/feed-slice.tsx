import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  feedRequest: boolean;
  feedError: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  feedRequest: false,
  feedError: null,
};

export const fetchFeed = createAsyncThunk(
  'orders/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error) {
      return rejectWithValue('Не удалось загрузить');
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.feedRequest = true;
        state.feedError = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feedRequest = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feedRequest = false;
        state.feedError = action.payload as string;
      });
  }
});

export default feedSlice.reducer;