// client/src/App.jsx
import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Homepage.jsx';
import AboutPage from './pages/AboutPage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import PaymentDemo from './pages/PaymentDemo';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Define paths where Header/Footer should be hidden (Login, Register, and all Admin routes)
  const hideHeaderFooter = 
    ['/login', '/register'].includes(location.pathname) || 
    location.pathname.startsWith('/admin');

  // Redirect logic: If already logged in, don't let them see login/register
  React.useEffect(() => {
    if (!loading && user && (location.pathname === '/login' || location.pathname === '/register')) {
      // Use user.role === 'admin' to match your AuthContext/Controller logic
      const targetPath = user.role === 'admin' ? '/admin/dashboard' : '/home';
      navigate(targetPath, { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  return (
    <div className="app-container">
      {/* Render Header only if not on hidden paths */}
      {!hideHeaderFooter && <Header />}

      {/* Main content wrapper with dynamic class for Admin vs Client view */}
      <main className={hideHeaderFooter ? "full-page" : "main-content container"}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Protected Client routes */}
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/collection" element={<PrivateRoute><CollectionPage /></PrivateRoute>} />
          <Route path="/product/:id" element={<PrivateRoute><ProductDetailPage /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          
          {/* Order history routes */}
          <Route path="/orders" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />
          <Route path="/orders/:orderId" element={<PrivateRoute><OrderHistoryPage showSingleOrder /></PrivateRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboardPage /></PrivateRoute>} />
          
          {/* Demo/Special routes */}
          <Route path="/payment-demo" element={<PaymentDemo />} />

          {/* Fallback 404 */}
          <Route path="*" element={
            <div style={{ padding: '100px', textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '4rem' }}>404</h1>
              <p>The acquisition you seek is not in our archives.</p>
            </div>
          } />
        </Routes>
      </main>

      {/* Render Footer only if not on hidden paths */}
      {!hideHeaderFooter && <Footer />}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;