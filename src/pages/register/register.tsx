import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';

import { RootState, useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/user-Slice';
import { selectRegisterUserError } from '../../services/selectors/user-selector';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const registerUserError = useSelector(selectRegisterUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(registerUser({ email, password, name: userName }));
  };

  return (
    <RegisterUI
      errorText={registerUserError}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
