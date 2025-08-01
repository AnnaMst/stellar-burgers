import { configureStore, combineSlices } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { combineReducers } from '@reduxjs/toolkit';
import { constructorReducer } from './slices/constructor-slice';
import { orderSlice } from './slices/order-slice';
import { ingredientsSlice } from './slices/ingredients-slice';
import { authSlice } from './slices/auth-slice';
import { userSlice } from './slices/user-Slice';
import feedSlice from './slices/feed-slice';

export const rootReducer = combineReducers({
  burgerConstructor: constructorReducer,
  order: orderSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  auth: authSlice.reducer,
  user: userSlice.reducer,
  feed: feedSlice,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
