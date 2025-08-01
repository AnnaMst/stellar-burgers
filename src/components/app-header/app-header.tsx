import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectCurrentUser } from '../../services/selectors/user-selector';

export const AppHeader: FC = () => {
  const user = useSelector(selectCurrentUser);

  return <AppHeaderUI userName={user?.name} />;
};