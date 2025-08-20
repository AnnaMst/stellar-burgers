import store from '../store';
import {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  updateUser,
  setUser,
  authChecked
} from '../slices/user-Slice';
import * as api from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

jest.mock('../../utils/burger-api');
jest.mock('../../utils/cookie');

describe('userSlice integration tests', () => {
  const mockUser = { email: 'test@test.com', name: 'Tester' };

    beforeAll(() => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
  });
});

jest.mock('@api', () => ({
  registerUserApi: jest.fn(() => Promise.resolve({ user: { email: 'test@test.com', name: 'Tester' } })),
  loginUserApi: jest.fn(() => Promise.resolve({ user: { email: 'test@test.com', name: 'Tester' } })),
  getUserApi: jest.fn(() => Promise.resolve({ user: { email: 'test@test.com', name: 'Tester' } })),
  logoutApi: jest.fn(() => Promise.resolve({ success: true })),
  updateUserApi: jest.fn(() => Promise.resolve({ user: { email: 'test@test.com', name: 'Tester' } })),
}));


  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register user', async () => {
    (api.registerUserApi as jest.Mock).mockResolvedValue({
      refreshToken: 'refresh',
      accessToken: 'access',
      user: mockUser
    });

    await store.dispatch(registerUser({ email: 'test@test.com', password: '123', name: 'Tester' }));

    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
  });

  it('should login user', async () => {
    (api.loginUserApi as jest.Mock).mockResolvedValue({
      refreshToken: 'refresh',
      accessToken: 'access',
      user: mockUser
    });

    await store.dispatch(loginUser({ email: 'test@test.com', password: '123' }));

    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
  });

  it('should get user', async () => {
    (api.getUserApi as jest.Mock).mockResolvedValue({ user: mockUser });

    await store.dispatch(getUser());

    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('should logout user', async () => {
    (api.logoutApi as jest.Mock).mockResolvedValue({});
    (deleteCookie as jest.Mock).mockImplementation(() => {});

    await store.dispatch(logoutUser());

    const state = store.getState().user;
    expect(state.user).toBeNull();
  });

  it('should update user', async () => {
    (api.updateUserApi as jest.Mock).mockResolvedValue({ user: mockUser });

    await store.dispatch(updateUser({ name: 'Tester', email: 'test@test.com' }));

    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
  });

  it('should set user and mark auth checked manually', () => {
    store.dispatch(setUser(mockUser));
    store.dispatch(authChecked());
    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });
});
