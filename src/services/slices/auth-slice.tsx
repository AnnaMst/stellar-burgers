import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';
import { setCookie } from '../../utils/cookie';

type TAuthState = {
  user: TUser | null;
  isLoading: boolean;
  isError: boolean;
  isAuthChecked: boolean;
};

const initialState: TAuthState = {
  user: null,
  isLoading: false,
  isError: false,
  isAuthChecked: false
};

export const getUser = createAsyncThunk('auth/getUser', async (_, thunkAPI) => {
  try {
    const res = await getUserApi();
    return res.user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue('Ошибка получения пользователя');
  }
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await loginUserApi({ email, password });
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Ошибка авторизации');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, name }: TRegisterData, thunkAPI) => {
    try {
      const res = await registerUserApi({ email, password, name });
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Ошибка регистрации');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      setCookie('accessToken', '', { expires: -1 }); // удалить куку
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка выхода');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthChecked = true;
    },
    setAuthChecked(state, action) {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isError = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isError = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  }
});

export const { logout, setAuthChecked } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
