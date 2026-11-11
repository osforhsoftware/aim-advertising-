import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Inbox,
  Users,
  LogOut,
  Menu,
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close mobile sidebar drawer automatically when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 991) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/services')) return 'Services Management';
    if (path.includes('/enquiries')) return 'Enquiries Management';
    if (path.includes('/users')) return 'Admin Users Management';
    return 'Dashboard Overview';
  };

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-sidebar-open' : ''}`}>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="/assets/logo.jpg" alt="AIM IAC" />
            {(!collapsed || mobileOpen) && (
              <div className="sidebar-brand-text">
                <span className="sidebar-brand-title">AIM IAC</span>
                <span className="sidebar-brand-subtitle">Admin CMS</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="mobile-close-sidebar"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
              <NavLink to="/admin/dashboard" end title="Dashboard">
                <LayoutDashboard size={20} />
                {(!collapsed || mobileOpen) && <span>Dashboard</span>}
              </NavLink>
            </li>
          </ul>

          {(!collapsed || mobileOpen) && <div className="sidebar-section-title">MANAGEMENT</div>}
          <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
              <NavLink to="/admin/services" title="Services">
                <Layers size={20} />
                {(!collapsed || mobileOpen) && <span>Services</span>}
              </NavLink>
            </li>
            <li className="sidebar-menu-item">
              <NavLink to="/admin/enquiries" title="Enquiries">
                <Inbox size={20} />
                {(!collapsed || mobileOpen) && <span>Enquiries</span>}
              </NavLink>
            </li>
          </ul>

          {(!collapsed || mobileOpen) && <div className="sidebar-section-title">SYSTEM</div>}
          <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
              <NavLink to="/admin/users" title="Admin Users">
                <Users size={20} />
                {(!collapsed || mobileOpen) && <span>Admin Users</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="user-info">
                <span className="user-name">{user?.name || 'Administrator'}</span>
                <span className="user-role">
                  <ShieldCheck size={11} style={{ display: 'inline', marginRight: 3 }} />
                  {user?.role ? user.role.replace('_', ' ') : 'Admin'}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn-sidebar-logout"
            onClick={logout}
            title="Sign out of Admin CMS"
          >
            <LogOut size={18} />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button
              type="button"
              className="btn-icon"
              onClick={handleSidebarToggle}
              title="Toggle menu"
              aria-label="Toggle navigation menu"
            >
              {collapsed ? <Menu size={20} className="desktop-collapse-icon" /> : <ChevronLeft size={20} className="desktop-collapse-icon" />}
              <Menu size={20} className="mobile-menu-icon" />
            </button>
            <div className="page-title-box">
              <h1>{getPageTitle()}</h1>
            </div>
          </div>

          <div className="header-right">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-website-link"
              title="Open public website in a new tab"
            >
              <span className="website-link-label">View Public Website</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
