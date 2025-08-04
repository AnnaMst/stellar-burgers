import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TConstructorIngredient } from '../../utils/types';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI, Preloader } from '@ui';
import {
  createOrderThunk,
  setOrderModalData
} from '../../services/slices/order-slice';
import { clearConstructor } from '../../services/slices/constructor-slice';
import { getIngredients } from '../../services/slices/ingredients-slice';

import {
  selectOrderModalData,
  selectOrderRequest
} from '../../services/selectors/order-selector';
import { selectConstructorItems } from '../../services/selectors/constructor-selector';
import { selectIngredients } from '../../services/selectors/ingredients-selector';
import { selectCurrentUser } from '../../services/selectors/user-selector';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const ingredients = useSelector(selectIngredients);

  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!ingredients.ingredients.length) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients.ingredients.length]);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const bunId = constructorItems.bun._id;
    const ingredientsIds = constructorItems.ingredients.map((item) => item._id);
    const orderData = [bunId, ...ingredientsIds, bunId];
    dispatch(createOrderThunk(orderData));
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
    dispatch(clearConstructor());
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
