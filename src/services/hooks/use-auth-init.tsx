import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getUser, setAuthChecked } from '../../services/slices/auth-slice';

export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      dispatch(getUser());
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);
};
