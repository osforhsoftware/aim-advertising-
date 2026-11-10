import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchPublicServices, fetchPublicServiceBySlug } from '../services/servicesApi';
import { servicesData } from '../data/servicesData';

const ServicesContext = createContext({
  services: [],
  loading: true,
  error: null,
  getService: () => null,
  refreshServices: () => {},
});

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublicServices();
      setServices(data);
    } catch (err) {
      console.warn('Failed to load services:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const getService = useCallback(
    (slug) => {
      if (!slug) return null;
      // Search in loaded state first
      const found = services.find((s) => s.slug === slug);
      if (found) return found;

      // Fallback search in static data
      const staticFound = servicesData.find((s) => s.slug === slug);
      return staticFound || null;
    },
    [services]
  );

  return (
    <ServicesContext.Provider
      value={{
        services,
        loading,
        error,
        getService,
        refreshServices: loadServices,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};

