import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../services/store';
import { selectRegisterUserError } from '../../services/selectors/user-selector';
import { loginUser } from '../../services/slices/user-Slice';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loginUserError = useSelector(selectRegisterUserError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const from = location.state?.from || '/profile';
        navigate(from, { replace: true });
      });
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
