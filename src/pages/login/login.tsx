import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useSelector } from 'react-redux';
import { loginUser } from '../../services/slices/auth-slice';
import { useDispatch } from '../../services/store';
import { selectRegisterUserError } from '../../services/selectors/user-selector';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const loginUserError = useSelector(selectRegisterUserError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={loginUserError ? 'Ошибка авторизации' : undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
