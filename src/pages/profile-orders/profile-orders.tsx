import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getUserOrdersThunk } from '../../services/slices/order-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector((state: RootState) => state.order.ordersHistory)
  const isLoading = useSelector((state: RootState) => state.order.ordersHistoryRequest)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserOrdersThunk());
  }, [dispatch])

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
