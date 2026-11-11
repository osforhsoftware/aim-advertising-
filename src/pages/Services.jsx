import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { useServices } from '../context/ServicesContext';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

const categories = ['All', 'Signages', 'Stickers', 'Branding', 'Printing', 'Fabrication'];

const Services = () => {
  const { services, loading } = useServices();
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    document.title = 'Services - AIM Advertising';
    window.scrollTo(0, 0);
  }, []);

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  return (
    <main>
      <Breadcrumb title="Services" activeLabel="Services" />

      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-kicker">Comprehensive Solutions</span>
            <h2 className="section-heading">Our Services</h2>
            <p className="section-subtitle">
              Signage, branding, printing, and display work from our Riyadh studio. Engineered to make your brand visible, professional, and memorable.
            </p>

            {/* Filter Tabs */}
            <div
              className="services-filter-tabs"
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
                marginTop: '2rem'
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="services-filter-btn"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-light-bg)',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--color-secondary)',
                    border: 'none',
                    boxShadow: selectedCategory === cat ? '0 4px 12px rgba(49, 164, 156, 0.3)' : 'none'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {loading && services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-primary)' }}>
              <Loader2 size={36} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.95rem' }}>Loading services from API...</p>
            </div>
          ) : (
            <div className="grid-3">
              {filteredServices.map((service, index) => {
                const serialNum = String(index + 1).padStart(2, '0');
                return (
                  <div key={service.id || service.slug} className="pbmit-service-style-1">
                    <div className="pbminfotech-post-item">
                      <div className="pbmit-service-image-wrapper">
                        <div className="pbmit-featured-wrapper">
                          <img
                            src={service.heroImg}
                            alt={service.title}
                            loading="lazy"
                          />
                        </div>
                        <div className="pbmit-service-btn-wrapper">
                          <Link
                            to={`/services/${service.slug}`}
                            className="pbmit-service-btn"
                            title={service.title}
                            aria-label={`View ${service.title}`}
                          >
                            <ArrowRight size={18} />
                          </Link>
                        </div>
                      </div>

                      <div className="pbmit-content-box">
                        <div className="pbminfotech-box-number">{serialNum}</div>
                        <div className="pbmit-serv-cat">{service.category || 'Advertising'}</div>
                        <h3 className="pbmit-service-title">
                          <Link to={`/services/${service.slug}`}>
                            {service.title}
                          </Link>
                        </h3>
                        <p className="pbmit-service-description">
                          {service.short_description || service.shortDesc}
                        </p>

                        <div className="pbmit-service-footer">
                          <Link
                            to={`/services/${service.slug}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontFamily: 'var(--font-heading)',
                              fontWeight: 700,
                              fontSize: '0.8125rem',
                              color: '#31a49c',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              textDecoration: 'none',
                            }}
                          >
                            <span>Learn More</span>
                            <ArrowRight size={14} />
                          </Link>

                          {service.icon && service.icon.includes('/uploads/') && (
                            <img
                              src={service.icon}
                              alt=""
                              className="pbmit-service-icon"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Consultation Banner */}
      <section
        style={{
          backgroundColor: 'var(--color-light-bg)',
          padding: '4rem 0',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <div className="container">
          <div className="services-cta-banner">
            <div>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.875rem' }}>
                Need a Custom Solution?
              </span>
              <h3 style={{ color: '#ffffff', fontSize: '1.875rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                Have a Complex Advertising or Signage Requirement?
              </h3>
              <p style={{ color: '#c9d2de', margin: 0, maxWidth: '600px' }}>
                Our engineering and design teams in Riyadh will review your specifications, site dimensions, and deadlines to deliver an exact tailored quote.
              </p>
            </div>

            <Link to="/contact-us" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
              <span>Request Free Consultation</span>
              <ArrowRight size={16} className="btn-arrow-icon" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;

