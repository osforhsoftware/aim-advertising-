import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate, useParams, Outlet } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Contact from './pages/Contact';
import { ServicesProvider } from './context/ServicesContext';

// Admin CMS Auth & Layout
import { AuthProvider } from './admin/context/AuthContext';
import { ToastProvider } from './admin/components/Toast';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';

// Lazy-loaded Admin Pages for optimal public site performance
const AdminLogin = lazy(() => import('./admin/pages/Login'));
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminServicesManager = lazy(() => import('./admin/pages/ServicesManager'));
const AdminEnquiriesManager = lazy(() => import('./admin/pages/EnquiriesManager'));
const AdminUsersManager = lazy(() => import('./admin/pages/AdminUsersManager'));

// Loading spinner for admin chunks
function AdminLoadingFallback() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f2f4',
      fontFamily: "'Quicksand', sans-serif",
      color: '#232e56',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#31a49c',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Loading Admin Portal...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Preserve legacy URL slug forwarding so /service/:slug cleanly redirects to /services/:slug
function LegacyServiceRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/services/${slug}`} replace />;
}

// Public layout wrapper (includes site Header, Footer, and ScrollToTop)
function PublicLayout() {
  return (
    <div className="site-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

// Admin root wrapper: encapsulates Auth and Toast providers strictly inside /admin
function AdminRoot() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Suspense fallback={<AdminLoadingFallback />}>
          <Outlet />
        </Suspense>
      </ToastProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <ServicesProvider>
      <Routes>
        {/* Admin CMS Portal (Entirely isolated under /admin) */}
        <Route path="/admin" element={<AdminRoot />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="services" element={<AdminServicesManager />} />
              <Route path="enquiries" element={<AdminEnquiriesManager />} />
              <Route path="users" element={<AdminUsersManager />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>
        </Route>

        {/* Public Website Routes (Wrapped with site Header & Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/about" element={<Navigate to="/about-us" replace />} />
          <Route path="/services" element={<Services />} />

          {/* Legacy WordPress Aliases and Slugs */}
          <Route path="/services/custom-stickers" element={<Navigate to="/services/sticker-works" replace />} />
          <Route path="/service/:slug" element={<LegacyServiceRedirect />} />

          {/* Individual Service Detail Routes */}
          <Route path="/services/:slug" element={<ServiceDetail />} />

          <Route path="/contact-us" element={<Contact />} />
          <Route path="/contact" element={<Navigate to="/contact-us" replace />} />

          {/* Redirect legacy blog routes to home */}
          <Route path="/blog-grid" element={<Navigate to="/" replace />} />
          <Route path="/blog" element={<Navigate to="/" replace />} />

          {/* Public Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ServicesProvider>
  );
}

export default App;
