import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { selectCurrentUser } from '../../services/selectors/user-selector';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/user-Slice';

export const Profile: FC = () => {
  const user = useSelector(selectCurrentUser)

  const [formValue, setFormValue] = useState<{
  name: string;
  email: string;
  password: string;
}>({
  name: user?.name || '',
  email: user?.email || '',
  password: ''
});


  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const dispatch = useDispatch();

const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const { name, email, password } = formValue;
    dispatch(updateUser({ name, email, password })).then(() => {
      setFormValue({
        name,
        email,
        password: ''
      });
    });
  };


  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
  email: user?.email || '',
  password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
