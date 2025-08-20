import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TRegisterData,
  registerUserApi,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (data, thunkAPI) => {
  try {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  } catch (error: any) {
    console.error('Ошибка регистрации:', error);
    return thunkAPI.rejectWithValue(
      error?.message || 'Ошибка при регистрации пользователя'
    );
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('user/loginUser', async (data, thunkAPI) => {
  try {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Ошибка при входе');
  }
});

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, thunkAPI) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка получения пользователя'
      );
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, thunkAPI) => {
    try {
      await logoutApi();

      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');

      return;
    } catch (error: any) {
      console.error('Ошибка выхода', error);
      return thunkAPI.rejectWithValue('Ошибка выхода');
    }
  }
);

export const checkUserAuth = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/checkUserAuth', async (_, { dispatch }) => {
  const accessToken = getCookie('accessToken');

  if (!accessToken) {
    dispatch(setUser(null));
    dispatch(authChecked());
    return;
  }

  try {
    const response = await getUserApi();
    dispatch(setUser(response.user));
  } catch (error) {
    console.error('Ошибка проверки авторизации', error);
    dispatch(setUser(null));
  } finally {
    dispatch(authChecked());
  }
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    {
      name,
      email,
      password
    }: { name: string; email: string; password?: string },
    thunkAPI
  ) => {
    try {
      const res = await updateUserApi({ name, email, password });
      return res.user;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Ошибка обновления профиля');
    }
  }
);

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  registerUserError?: string;
  loginUserError?: string;
  logoutUserError?: string;
};

const initialState: TUserState = {
  user: null,
  isLoading: false,
  isAuthChecked: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
    },
    authChecked(state) {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.registerUserError = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.registerUserError = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginUserError = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginUserError = action.payload;
      })

      // Get user
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.logoutUserError = undefined;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutUserError = action.payload;
      })

      // Update
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { setUser, authChecked } = userSlice.actions;

export default userSlice.reducer;
