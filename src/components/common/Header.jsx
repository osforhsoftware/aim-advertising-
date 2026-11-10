import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Phone, ChevronDown, Menu, ArrowUpRight, Search, X } from 'lucide-react';
import MobileDrawer from './MobileDrawer';
import { useServices } from '../../context/ServicesContext';
import { servicesData } from '../../data/servicesData';
import '../../styles/header.css';

const Header = () => {
  const { services } = useServices();
  const navServices = services && services.length > 0 ? services : servicesData;
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer and search on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Handle escape key to close search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim()
    ? navServices.filter((s) => {
        const q = searchQuery.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          (s.short_description || s.shortDesc || '').toLowerCase().includes(q)
        );
      })
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(`/services/${searchResults[0].slug}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className={`site-header ${isSticky ? 'is-sticky' : ''}`}>
        <div className="container">
          <div className="header-main-content">
            {/* Brand Logo */}
            <Link to="/" className="header-logo-link" aria-label="AIM Advertising Home">
              <img
                src="/assets/images/logo.jpg"
                alt="AIM Advertising - Best Designing Company in Riyadh"
                className="header-logo-img"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav" aria-label="Primary Navigation">
              <ul className="nav-list">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    HOME
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/about-us"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    ABOUT US
                  </NavLink>
                </li>

                {/* Services Dropdown */}
                <li className="nav-item has-dropdown">
                  <NavLink
                    to="/services"
                    className={({ isActive }) =>
                      `nav-link ${isActive || location.pathname.startsWith('/services') ? 'active' : ''}`
                    }
                  >
                    <span>SERVICES</span>
                    <ChevronDown size={14} />
                  </NavLink>
                  <ul className="dropdown-menu">
                    {navServices.map((service) => (
                      <li key={service.id || service.slug} className="dropdown-item">
                        <Link to={`/services/${service.slug}`}>
                          {service.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/contact-us"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    CONTACT US
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* Right Action Items */}
            <div className="header-actions">
              <a href="tel:+966565219639" className="header-phone-box" title="Call Us">
                <div className="phone-circle">
                  <Phone size={18} color="#ffffff" />
                </div>
                <span className="phone-text">+966 565 21 96 39</span>
              </a>

              <button
                type="button"
                className="header-search-btn"
                aria-label="Open search"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={20} />
              </button>

              <Link to="/contact-us" className="header-quote-pill">
                <span>Get A Quote</span>
                <ArrowUpRight size={17} />
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile navigation"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Xcleen Header Search Overlay Modal */}
      {searchOpen && (
        <div
          className="pbmit-header-search-form-wrapper open"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 24, 55, 0.95)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.25s ease',
          }}
          onClick={() => setSearchOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            className="pbmit-search-close"
            style={{
              position: 'absolute',
              top: '2.5rem',
              right: '2.5rem',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transition: 'background-color 0.2s',
            }}
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            <X size={24} />
          </button>

          <div
            style={{ width: '100%', maxWidth: '720px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ color: '#31a49c', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Search AIM Advertising
              </span>
              <h2 style={{ color: '#ffffff', fontSize: '2rem', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
                Find Signage & Advertising Services
              </h2>
            </div>

            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <input
                ref={searchInputRef}
                type="search"
                className="search-field"
                placeholder="Type service name (e.g. Signages, Stickers, Acrylic...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.25rem 4rem 1.25rem 1.5rem',
                  fontSize: '1.25rem',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  outline: 'none',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  color: '#001837',
                  fontFamily: 'var(--font-heading)',
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#31a49c',
                  color: '#ffffff',
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Quick Live Search Results */}
            {searchQuery.trim() && (
              <div
                style={{
                  marginTop: '1.5rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  maxHeight: '340px',
                  overflowY: 'auto',
                  padding: '1rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <Link
                      key={item.id || item.slug}
                      to={`/services/${item.slug}`}
                      onClick={() => setSearchOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#001837', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                          /services/{item.slug}
                        </div>
                      </div>
                      <ArrowUpRight size={18} color="#31a49c" />
                    </Link>
                  ))
                ) : (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>
                    No services found matching "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Offcanvas Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;
