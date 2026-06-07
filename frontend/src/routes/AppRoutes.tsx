import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { SellerLayout } from '../layouts/SellerLayout';

// Public / Auth Pages
import { Home } from '../pages/Home';
import { ProductListing } from '../pages/ProductListing';
import { ProductDetails } from '../pages/ProductDetails';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { AccessDenied } from '../pages/AccessDenied';

// Protected Customer Pages
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { PaymentSuccess } from '../pages/PaymentSuccess';
import { PaymentFailed } from '../pages/PaymentFailed';
import { Orders } from '../pages/Orders';
import { OrderDetails } from '../pages/OrderDetails';
import { Profile } from '../pages/Profile';

// Seller Portal Pages
import { SellerDashboardHome } from '../pages/seller/SellerDashboardHome';
import { SellerProducts } from '../pages/seller/SellerProducts';
import { SellerOrders } from '../pages/seller/SellerOrders';
import { SellerPayments } from '../pages/seller/SellerPayments';
import { SellerAnalytics } from '../pages/seller/SellerAnalytics';
import { SellerNotifications } from '../pages/seller/SellerNotifications';
import { SellerSettings } from '../pages/seller/SellerSettings';

// Route Guards & Context
import { RequireUserRole } from '../components/routes/RequireUserRole';
import { RequireSellerRole } from '../components/routes/RequireSellerRole';
import { useAuthStore } from '../store/authStore';

// Entry point: checks auth state and routes to correct portal
const RootRedirect: React.FC = () => {
  const { user } = useAuthStore();

  if (user?.role === 'seller') {
    return <Navigate to="/seller" replace />;
  }

  return <Navigate to="/customer" replace />;
};

// Guard to block authenticated users from viewing auth screens (Login, Signup, etc.)
const GuestOnlyRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user) {
    if (user.role === 'seller') {
      return <Navigate to="/seller" replace />;
    }
    return <Navigate to="/customer" replace />;
  }

  return <Outlet />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Root and Entry Point Redirects */}
      <Route path="/" element={<RootRedirect />} />

      {/* 2. Guest-Only Auth Route Group (no Navbar/Footer — clean auth experience) */}
      <Route element={<AuthLayout />}>
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* Access Denied — keeps full layout with Navbar */}
      <Route element={<PublicLayout />}>
        <Route path="/access-denied" element={<AccessDenied />} />
      </Route>

      {/* 3. Customer Routes */}
      <Route path="/customer" element={<PublicLayout />}>
        {/* Public Catalog Routes */}
        <Route index element={<Home />} />
        <Route path="products" element={<ProductListing />} />
        <Route path="product/:id" element={<ProductDetails />} />

        {/* Secure Customer Routes (wrapped under RequireUserRole) */}
        <Route element={<RequireUserRole />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/failed" element={<PaymentFailed />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order/:id" element={<OrderDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* 4. Secure Seller Routes (wrapped under SellerLayout + RequireSellerRole) */}
      <Route element={<RequireSellerRole />}>
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<SellerDashboardHome />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="payments" element={<SellerPayments />} />
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="notifications" element={<SellerNotifications />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>
      </Route>

      {/* Wildcard Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
