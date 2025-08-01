import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { getOrderByNumberThunk } from '../../services/slices/order-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector(
    (state: RootState) => state.order.orderModalData
  );
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  // 🔹 Загружаем заказ, если его нет в сторе
  useEffect(() => {
    if (!orderData && number) {
      dispatch(getOrderByNumberThunk(Number(number)));
    }
  }, [dispatch, number, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce((acc, item) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (ingredient) {
        if (!acc[item]) {
          acc[item] = { ...ingredient, count: 1 };
        } else {
          acc[item].count++;
        }
      }
      return acc;
    }, {} as Record<string, TIngredient & { count: number }>);

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
