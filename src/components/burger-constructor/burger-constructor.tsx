import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '../../utils/types';
import { BurgerConstructorUI } from '../ui';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients-slice';
import { Preloader } from '@ui';
import { createOrderThunk, setOrderModalData } from '../../services/slices/order-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const orderRequest = useSelector(
    (state: RootState) => state.order.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.order.orderModalData
  );
  const ingredients = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (!ingredients.ingredients.length) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients.ingredients.length]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const bunId = constructorItems.bun._id;
    const ingredientsIds = constructorItems.ingredients.map((item) => item._id);
    const orderData = [bunId, ...ingredientsIds, bunId]; // булка дважды

    dispatch(createOrderThunk(orderData));
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  if (ingredients.ingredientsRequest) return <Preloader />;
  if (ingredients.IngredientsError) return <p>Ошибка загрузки ингредиентов</p>;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
