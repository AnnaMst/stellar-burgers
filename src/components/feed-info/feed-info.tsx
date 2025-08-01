import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { RootState } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {

  const selectOrdersData = (state: RootState) => state.feed.orders;

const selectTotalOrders = (state: RootState) => state.feed.total;

const selectTodayOrders = (state: RootState) => state.feed.totalToday;

  const orders: TOrder[] = useSelector(selectOrdersData);
  const totalFeeds = useSelector(selectTotalOrders);
  const todayFeeds = useSelector(selectTodayOrders);

  const feed = { total: totalFeeds, totalToday: todayFeeds };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
