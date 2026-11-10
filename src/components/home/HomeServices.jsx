import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useServices } from '../../context/ServicesContext';
import { servicesData } from '../../data/servicesData';

const HomeServices = () => {
  const { services } = useServices();
  const displayServices = services && services.length > 0 ? services : servicesData;

  // Display the 2 primary featured services matching reference layout
  const displayed = displayServices.slice(0, 2);

  return (
    <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-kicker">Our Services</span>
          <h2 className="section-heading">Signage & Print Solutions for Your Brand</h2>
          <p className="section-subtitle">
            From shopfront signage to large-format print, each service is built around elevating your brand presence across Riyadh.
          </p>
        </div>

        {/* 2-Column Wide Gradient Card Grid */}
        <div className="home-services-grid">
          {displayed.map((service) => (
            <Link
              key={service.id || service.slug}
              to={`/services/${service.slug}`}
              className="home-service-card"
              title={`View ${service.title}`}
            >
              {/* Background Photo */}
              <div className="home-service-bg">
                <img
                  src={service.heroImg || service.banner_image || '/assets/services/signages-hero.jpg'}
                  alt={service.title}
                  loading="lazy"
                />
              </div>

              {/* Contrast Gradient Overlay */}
              <div className="home-service-overlay" />

              {/* Text & Icon Button */}
              <div className="home-service-content">
                <h3 className="home-service-title">{service.title}</h3>
                <p className="home-service-desc">
                  {service.short_description || service.shortDesc}
                </p>
                <div className="home-service-action">
                  <span className="home-service-btn" aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Action: View All Services */}
        <div className="home-services-actions">
          <Link to="/services" className="btn-view-all-services">
            <span>View All Services</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeServices;
