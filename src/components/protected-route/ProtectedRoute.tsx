import { useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../services/store'; // путь к твоему store.ts

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.user);

  if (!user) {
    // если пользователя нет — редиректим на login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
