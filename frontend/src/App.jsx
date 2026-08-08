import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AISearchModal from './components/AISearchModal';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Browse from './pages/Browse';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import UserProfilePage from './pages/UserProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState('');

  // Initialize Lenis smooth scroll engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleOpenAISearch = (query = '') => {
    setAiInitialQuery(query);
    setAiModalOpen(true);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar onOpenAISearch={handleOpenAISearch} />
                
                <main style={{ flex: 1 }}>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Home onOpenAISearch={handleOpenAISearch} />} />
                      <Route path="/browse" element={<Browse />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                      <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <UserProfilePage />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute requireAdmin={true}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </ErrorBoundary>
                </main>

                <Footer />
                
                <AISearchModal
                  isOpen={aiModalOpen}
                  initialQuery={aiInitialQuery}
                  onClose={() => {
                    setAiModalOpen(false);
                    setAiInitialQuery('');
                  }}
                />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
