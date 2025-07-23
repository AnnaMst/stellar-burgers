import { useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../services/store';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // временно берем пользователя напрямую
  const user = true; // заглушка

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};
