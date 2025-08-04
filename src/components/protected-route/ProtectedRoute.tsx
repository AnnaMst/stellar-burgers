import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectCurrentUser,
  selectIsAuthChecked
} from '../../services/selectors/user-selector';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/register' state={{ from: location }} replace />;
  }

  return children;
};
