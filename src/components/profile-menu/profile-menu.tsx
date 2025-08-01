import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutApi } from '../../utils/burger-api';
import { deleteCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { logout } from '../../services/slices/auth-slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Ошибка при выходе из системы', error);
    } finally {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
