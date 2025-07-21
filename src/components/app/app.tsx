import { ConstructorPage, Feed, ForgotPassword, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
	Routes,
	Route,
} from 'react-router-dom';


import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <Routes>
      <Route path="/" element={<ConstructorPage />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/login" 
             element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
             } 
      />
      <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
      <Route path="/reset-password" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/orders" element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
      <Route path="*" element={<NotFound404 />} />

      <Route
            path="/feed/:number"
            element={
              <Modal title={''} onClose={function (): void {
                throw new Error('Function not implemented.');
              } }>
                <OrderInfo />
              </Modal>
            }
      />
      <Route
            path="/ingredients/:id"
            element={
              <Modal title={''} onClose={function (): void {
                throw new Error('Function not implemented.');
              } }>
                <IngredientDetails />
              </Modal>
            }
      />      
      <Route
            path="/profile/orders/:number"
            element={
              <Modal title={''} onClose={function (): void {
                throw new Error('Function not implemented.');
              } }>
                <OrderInfo />
              </Modal>
            }
        />
    </Routes>
  </div>
);

export default App;
