import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getUserOrdersThunk } from '../../services/slices/order-slice';
import { Preloader } from '@ui';
import {
  selectUserOrdersHistory,
  selectUserOrdersHistoryRequest
} from '../../services/selectors/order-selector';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectUserOrdersHistory);
  const isLoading = useSelector(selectUserOrdersHistoryRequest);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrdersThunk());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
