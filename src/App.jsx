import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import VendorsTable from './components/admin/VendorsTable';
import CategoriesTable from './components/admin/CategoriesTable';
import ProductsTable from './components/admin/ProductsTable';
import Login from './pages/admin/Login';
import OrdersTable from './components/admin/OrdersTable';
import LocationsTable from './components/admin/LocationsTable';
import FeedbacksTable from './components/admin/FeedbacksTable';

// Storefront Components
import Home from './pages/storefront/Home';
import CartSidebar from './components/storefront/CartSidebar';
import AuthModal from './components/storefront/AuthModal';
import Checkout from './pages/storefront/Checkout';
import VerifyPayment from './pages/storefront/VerifyPayment';
import VerifyEmail from './pages/storefront/VerifyEmail';
import Account from './pages/storefront/Account';
import ProductDetails from './pages/storefront/ProductDetails';
import About from './pages/storefront/About';
import CategoryPage from './pages/storefront/CategoryPage';

import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'vendors': return <VendorsTable />;
      case 'categories': return <CategoriesTable />;
      case 'products': return <ProductsTable />;
      case 'orders': return <OrdersTable />;
      case 'locations': return <LocationsTable />;
      case 'feedbacks': return <FeedbacksTable />;
      case 'overview': return <div className="p-6 bg-white rounded-xl border border-gray-100 text-gray-500">Overview metrics will render here.</div>;
      default: return <div className="p-6 bg-white rounded-xl border border-gray-100 text-gray-500">Work in progress.</div>;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
};

function App() {

  const { token } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [token, fetchCart]);
  return (
    <BrowserRouter>
     <CartSidebar />
     <AuthModal />
      <Routes>
        {/* Public Storefront Route */}
        <Route path="/" element={<Home />} />
        
        {/* Admin Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/about" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verify" element={<VerifyPayment />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/account" element={<Account />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;