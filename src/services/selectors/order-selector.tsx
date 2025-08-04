import { RootState } from '../store';

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectUserOrdersHistory = (state: RootState) =>
  state.order.ordersHistory;
export const selectUserOrdersHistoryRequest = (state: RootState) =>
  state.order.ordersHistoryRequest;
