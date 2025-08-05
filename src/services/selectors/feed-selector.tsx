import { RootState } from '../store';

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedOrdersRequest = (state: RootState) =>
  state.feed.feedRequest;
