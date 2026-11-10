import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/services')) return 'Services Management';
    if (path.includes('/enquiries')) return 'Enquiries Management';
    if (path.includes('/users')) return 'Admin Users Management';
    return 'Dashboard Overview';
  };

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="/assets/logo.jpg" alt="AIM IAC" />
            {!collapsed && (
              <div className="sidebar-brand-text">
                <span className="sidebar-brand-title">AIM IAC</span>
                <span className="sidebar-brand-subtitle">Admin CMS</span>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
              <NavLink to="/admin/dashboard" end title="Dashboard">
                <LayoutDashboard size={20} />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>
            </li>
          </ul>

          {!collapsed && <div className="sidebar-section-title">MANAGEMENT</div>}
          <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
              <NavLink to="/admin/services" title="Services">
                <Layers size={20} />
                {!collapsed && <span>Services</span>}
              </NavLink>
            </li>
            <li className="sidebar-menu-item">
              <NavLink to="/admin/enquiries" title="Enquiries">
                <Inbox size={20} />
                {!collapsed && <span>Enquiries</span>}
              </NavLink>
            </li>
          </ul>

          {!collapsed && <div className="sidebar-section-title">SYSTEM</div>}
          <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
              <NavLink to="/admin/users" title="Admin Users">
                <Users size={20} />
                {!collapsed && <span>Admin Users</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            {!collapsed && (
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
            {!collapsed && <span>Logout</span>}
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
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
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
              <span>View Public Website</span>
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
