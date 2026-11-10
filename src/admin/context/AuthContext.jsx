import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { initCsrf } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session from PHP session API
  const checkAuth = useCallback(async () => {
    // Only check auth if current route is inside /admin
    if (!window.location.pathname.startsWith('/admin')) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/api/v1/auth/me');
      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // SPA Login
  const login = async (email, password) => {
    await initCsrf();
    const res = await api.post('/api/v1/auth/login', { email, password });

    if (res.data && res.data.user) {
      setUser(res.data.user);
      return res.data;
    }
    throw new Error('Invalid login response from server');
  };

  // SPA Logout
  const logout = async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (err) {
      console.warn('Logout API failed or session expired:', err.message);
    } finally {
      setUser(null);
      window.location.href = '/admin/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

