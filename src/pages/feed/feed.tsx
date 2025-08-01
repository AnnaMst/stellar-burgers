import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feed-slice';


export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector((state: RootState) => state.feed.orders);
  const isLoading = useSelector((state: RootState) => state.feed.feedRequest);
    const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchFeed());
    }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  } 
  
  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />;
};
