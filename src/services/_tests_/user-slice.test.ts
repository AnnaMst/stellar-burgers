// cypress/store-tests/userSlice.test.ts
import store from '../store';
import { registerUser, loginUser, getUser, logoutUser, updateUser, setUser, authChecked } from '../slices/user-Slice';
import * as api from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

jest.mock('../../utils/burger-api');
jest.mock('../../utils/cookie');

describe('userSlice integration tests', () => {
  const mockUser = { email: 'test@test.com', name: 'Tester' };

  beforeAll(() => {
    const localStorageMock = (() => {
      let store: Record<string,string> = {};
      return {
        getItem: (key:string) => store[key] || null,
        setItem: (key:string, value:string) => { store[key] = value; },
        removeItem: (key:string) => { delete store[key]; },
        clear: () => { store = {}; },
      };
    })();
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });
  });

  beforeEach(() => jest.clearAllMocks());

  it('should register and login user', async () => {
    (api.registerUserApi as jest.Mock).mockResolvedValue({ refreshToken:'refresh', accessToken:'access', user:mockUser });
    await store.dispatch(registerUser({ email:'test@test.com', password:'123', name:'Tester' }));
    expect(store.getState().user.user).toEqual(mockUser);

    (api.loginUserApi as jest.Mock).mockResolvedValue({ refreshToken:'refresh', accessToken:'access', user:mockUser });
    await store.dispatch(loginUser({ email:'test@test.com', password:'123' }));
    expect(store.getState().user.user).toEqual(mockUser);
  });

  it('should get and logout user', async () => {
    (api.getUserApi as jest.Mock).mockResolvedValue({ user: mockUser });
    await store.dispatch(getUser());
    expect(store.getState().user.user).toEqual(mockUser);

    (api.logoutApi as jest.Mock).mockResolvedValue({});
    (deleteCookie as jest.Mock).mockImplementation(() => {});
    await store.dispatch(logoutUser());
    expect(store.getState().user.user).toBeNull();
  });

  it('should update user', async () => {
    (api.updateUserApi as jest.Mock).mockResolvedValue({ user: mockUser });
    await store.dispatch(updateUser({ name:'Tester', email:'test@test.com' }));
    expect(store.getState().user.user).toEqual(mockUser);
  });

  it('should set user and mark auth checked', () => {
    store.dispatch(setUser(mockUser));
    store.dispatch(authChecked());
    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });
});
