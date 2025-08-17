import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { getOrderByNumberThunk } from '../../services/slices/order-slice';
import { selectIngredientsItems } from '../../services/selectors/ingredients-selector';
import { selectOrderModalData } from '../../services/selectors/order-selector';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector(selectOrderModalData);
  const ingredients = useSelector(selectIngredientsItems);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumberThunk(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          if (!acc[item]) {
            acc[item] = { ...ingredient, count: 1 };
          } else {
            acc[item].count++;
          }
        }
        return acc;
      },
      {} as Record<string, TIngredient & { count: number }>
    );

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

  return (
    <>
      <p className={`text text_type_digits-default mb-4`}>
        #{number?.padStart(6, '0')}
      </p>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
