import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, ChevronDown, ChevronUp, Phone, Mail, MapPin } from 'lucide-react';
import { useServices } from '../../context/ServicesContext';
import { servicesData } from '../../data/servicesData';
import '../../styles/mobileDrawer.css';

const MobileDrawer = ({ isOpen, onClose }) => {
  const { services } = useServices();
  const drawerServices = services && services.length > 0 ? services : servicesData;
  const [servicesExpanded, setServicesExpanded] = useState(false);

  return (
    <>
      <div
        className={`drawer-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`mobile-drawer ${isOpen ? 'is-open' : ''}`} aria-label="Mobile Navigation">
        <div className="drawer-header">
          <Link to="/" onClick={onClose}>
            <img
              src="/assets/images/logo.jpg"
              alt="AIM Advertising"
              className="drawer-logo"
            />
          </Link>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="drawer-nav">
          <ul className="drawer-nav-list">
            <li className="drawer-nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                Home
              </NavLink>
            </li>
            <li className="drawer-nav-item">
              <NavLink
                to="/about-us"
                className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                About Us
              </NavLink>
            </li>
            <li className="drawer-nav-item">
              <div className="drawer-nav-link" style={{ cursor: 'pointer' }}>
                <NavLink
                  to="/services"
                  style={{ flex: 1 }}
                  onClick={onClose}
                >
                  Services
                </NavLink>
                <button
                  type="button"
                  className="drawer-submenu-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setServicesExpanded(!servicesExpanded);
                  }}
                  aria-label="Toggle services list"
                >
                  {servicesExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {servicesExpanded && (
                <ul className="drawer-submenu">
                  {drawerServices.map((service) => (
                    <li key={service.id || service.slug}>
                      <NavLink
                        to={`/services/${service.slug}`}
                        className="drawer-sub-link"
                        onClick={onClose}
                      >
                        {service.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="drawer-nav-item">
              <NavLink
                to="/contact-us"
                className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="drawer-footer">
          <div className="drawer-contact-item">
            <Phone size={16} color="#31a49c" />
            <a href="tel:+966565219639">+966 565 21 96 39</a>
          </div>
          <div className="drawer-contact-item">
            <Mail size={16} color="#31a49c" />
            <a href="mailto:info@aimiac.com">info@aimiac.com</a>
          </div>
          <div className="drawer-contact-item">
            <MapPin size={16} color="#31a49c" />
            <span>Wasat Al Mujamma Bldg, Riyadh</span>
          </div>

          <Link
            to="/contact-us"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={onClose}
          >
            Get a Quote
          </Link>
        </div>
      </aside>
    </>
  );
};

export default MobileDrawer;

