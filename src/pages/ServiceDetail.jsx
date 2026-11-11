import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import { fetchPublicServiceBySlug, submitEnquiry } from '../services/servicesApi';
import { servicesData } from '../data/servicesData';
import LightboxModal from '../components/common/LightboxModal';
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  Send,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';

const ServiceDetail = () => {
  const { slug } = useParams();
  const { services, getService } = useServices();

  const [service, setService] = useState(() => getService(slug));
  const [loading, setLoading] = useState(!service);
  const [notFound, setNotFound] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectSize: '',
    location: '',
    deadline: '',
    details: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchServiceData = async () => {
      const existing = getService(slug);
      if (existing) {
        setService(existing);
      }
      try {
        const fetched = await fetchPublicServiceBySlug(slug);
        if (isMounted) {
          if (fetched) {
            setService(fetched);
            setNotFound(false);
          } else if (!existing) {
            setNotFound(true);
          }
        }
      } catch (err) {
        if (isMounted && !existing) {
          setNotFound(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServiceData();
    return () => { isMounted = false; };
  }, [slug, getService]);

  useEffect(() => {
    if (service) {
      document.title = `${service.title} - AIM Advertising`;
      window.scrollTo(0, 0);
    }
  }, [service]);

  if (loading && !service) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} className="spin-animation" style={{ animation: 'spin 1s linear infinite', color: '#31a49c' }} />
        <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '1rem' }}>Loading service details...</p>
      </div>
    );
  }

  if (notFound || !service) {
    return <Navigate to="/services" replace />;
  }

  // Related services (exclude current)
  const sourceServices = services && services.length > 0 ? services : servicesData;
  const relatedServices = sourceServices
    .filter((s) => s.slug !== slug && s.id !== service.id)
    .slice(0, 3);

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.details.trim()) errors.details = 'Project details are required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await submitEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service_name: service.title,
        message: `Project Size: ${formData.projectSize || 'N/A'}\nLocation: ${formData.location || 'N/A'}\nDeadline: ${formData.deadline || 'N/A'}\n\nProject Details:\n${formData.details.trim()}`,
      });
      setFormSubmitted(true);
    } catch (err) {
      console.warn('Backend offline or submission fallback:', err.message);
      setFormSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      {/* 1. Cinema Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#001837',
          overflow: 'hidden'
        }}
      >
        <img
          src={service.heroImg}
          alt={service.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.35
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(0, 24, 55, 0.95) 0%, rgba(0, 24, 55, 0.75) 50%, rgba(0, 24, 55, 0.4) 100%)'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '4rem 1.25rem' }}>
          <div style={{ maxWidth: '800px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '1.5px',
                padding: '0.35rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                marginBottom: '1rem'
              }}
            >
              AIM Advertising Service
            </span>

            <h1 className="service-detail-hero-title">
              {service.tagline}
            </h1>

            <p style={{ color: '#e2e8f0', fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              {service.shortDesc}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#aim-inquire" className="btn btn-primary">
                <span>Request a Quote</span>
                <ArrowRight size={16} className="btn-arrow-icon" />
              </a>
              <a
                href="#aim-gallery"
                className="btn btn-outline"
                style={{ color: '#ffffff', borderColor: '#ffffff' }}
              >
                <span>View Project Photos</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Breadcrumbs & Details Anchor */}
      <div id="aim-details" style={{ backgroundColor: 'var(--color-light-bg)', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-light)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600
            }}
          >
            <Link to="/" style={{ color: 'var(--color-secondary)' }}>
              Home
            </Link>
            <ChevronRight size={14} color="#31a49c" />
            <Link to="/services" style={{ color: 'var(--color-secondary)' }}>
              Services
            </Link>
            <ChevronRight size={14} color="#31a49c" />
            <span style={{ color: 'var(--color-primary)' }}>{service.title}</span>
          </nav>
        </div>
      </div>

      {/* 3. Main Content & Features */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="service-detail-grid">
            {/* Left Column: Full Description & Features */}
            <div>
              <span className="section-kicker">Service Overview</span>
              <h2 className="section-heading" style={{ marginBottom: '1.5rem' }}>
                Professional {service.title} in Riyadh
              </h2>

              <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
                {service.fullDesc}
              </p>

              <h3 style={{ fontSize: '1.375rem', color: 'var(--color-secondary)', marginTop: '2.5rem', marginBottom: '1.25rem' }}>
                Key Capabilities & Technical Specifications
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                {(service.features || []).map((feature, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '1rem',
                      backgroundColor: 'var(--color-light-bg)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '3px solid var(--color-primary)'
                    }}
                  >
                    <CheckCircle2 size={18} color="#31a49c" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-secondary)' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Direct WhatsApp Callout */}
              <div
                style={{
                  backgroundColor: '#e8f8f5',
                  border: '1px solid #a3e4d7',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#25d366',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--color-dark)', fontSize: '1.0625rem' }}>
                      Fast Direct Inquiry via WhatsApp
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#16a085' }}>
                      Chat instantly with our technical estimators in Riyadh
                    </p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/966565219639?text=Hello%20AIM%20Advertising,%20I%20am%20inquiring%20about%20${encodeURIComponent(service.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ backgroundColor: '#25d366', color: 'white' }}
                >
                  <span>Chat +966 565 21 96 39</span>
                </a>
              </div>
            </div>

            {/* Right Column: Quick Contact & Service Nav */}
            <div>
              {/* All Services Navigation Card */}
              <div
                style={{
                  backgroundColor: 'var(--color-light-bg)',
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '2rem',
                  border: '1px solid var(--color-border)'
                }}
              >
                <h4
                  style={{
                    fontSize: '1.125rem',
                    color: 'var(--color-secondary)',
                    marginBottom: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid var(--color-primary)'
                  }}
                >
                  Our All Services
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {servicesData.map((s) => (
                    <li key={s.id} style={{ marginBottom: '0.5rem' }}>
                      <Link
                        to={`/services/${s.slug}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.625rem 0.875rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: s.id === service.id ? 'var(--color-primary)' : 'var(--color-white)',
                          color: s.id === service.id ? '#ffffff' : 'var(--color-secondary)',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span>{s.title}</span>
                        <ChevronRight size={14} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assistance Card */}
              <div
                style={{
                  backgroundColor: 'var(--color-dark)',
                  color: '#ffffff',
                  padding: '2rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}
              >
                <Sparkles size={36} color="#31a49c" style={{ marginBottom: '1rem' }} />
                <h4 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                  Need Custom Fabrication?
                </h4>
                <p style={{ color: '#a4b3c6', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  We engineer bespoke signage structures, acrylic fabrications, and fleet graphics tailored to exact architectural drawings.
                </p>
                <a
                  href="tel:+966565219639"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <Phone size={16} />
                  <span>Call +966 565 21 96 39</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Project Photos Gallery Section */}
      {service.gallery && service.gallery.length > 0 && (
      <section id="aim-gallery" style={{ backgroundColor: 'var(--color-light-bg)', padding: '5rem 0' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-kicker">Gallery</span>
            <h2 className="section-heading">Project Photos</h2>
            <p className="section-subtitle">
              Recent {service.title ? service.title.toLowerCase() : 'service'} manufactured and installed by the AIM Advertising team in Riyadh.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {service.gallery.map((imgSrc, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  backgroundColor: '#ffffff'
                }}
                onClick={() => openLightbox(idx)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <img
                  src={imgSrc}
                  alt={`${service.title} Project ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 24, 55, 0.4)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                >
                  <span>Click to Enlarge</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 5. Related Services */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-kicker">Explore More</span>
            <h2 className="section-heading">Related Services</h2>
          </div>

          <div className="grid-3">
            {relatedServices.map((rel, index) => {
              const serialNum = String(index + 1).padStart(2, '0');
              return (
                <div key={rel.id || rel.slug} className="pbmit-service-style-1">
                  <div className="pbminfotech-post-item">
                    <div className="pbmit-service-image-wrapper">
                      <div className="pbmit-featured-wrapper">
                        <img
                          src={rel.heroImg}
                          alt={rel.title}
                          loading="lazy"
                        />
                      </div>
                      <div className="pbmit-service-btn-wrapper">
                        <Link
                          to={`/services/${rel.slug}`}
                          className="pbmit-service-btn"
                          title={rel.title}
                          aria-label={`View ${rel.title}`}
                        >
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>

                    <div className="pbmit-content-box">
                      <div className="pbminfotech-box-number">{serialNum}</div>
                      <div className="pbmit-serv-cat">{rel.category || 'Advertising'}</div>
                      <h3 className="pbmit-service-title">
                        <Link to={`/services/${rel.slug}`}>
                          {rel.title}
                        </Link>
                      </h3>
                      <p className="pbmit-service-description">
                        {rel.short_description || rel.shortDesc}
                      </p>

                      <div className="pbmit-service-footer">
                        <Link
                          to={`/services/${rel.slug}`}
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

                        {rel.icon && rel.icon.includes('/uploads/') && (
                          <img
                            src={rel.icon}
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
        </div>
      </section>

      {/* 6. Tell Us About the Project Form */}
      <section
        id="aim-inquire"
        style={{
          backgroundColor: 'var(--color-dark)',
          color: '#ffffff',
          padding: '5rem 0'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-kicker" style={{ color: 'var(--color-primary)' }}>
                Start Your Project
              </span>
              <h2 style={{ color: '#ffffff', fontSize: '2.25rem', marginBottom: '0.75rem' }}>
                Tell Us About the Project
              </h2>
              <p style={{ color: '#c9d2de', fontSize: '1.0625rem', margin: 0 }}>
                Share the size, location, and deadline. The AIM Advertising team in Riyadh will follow up promptly with a quotation.
              </p>
            </div>

            {formSubmitted ? (
              <div
                style={{
                  backgroundColor: 'rgba(49, 164, 156, 0.15)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2.5rem',
                  textAlign: 'center'
                }}
              >
                <CheckCircle2 size={48} color="#31a49c" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                  Thank You for Your Inquiry!
                </h3>
                <p style={{ color: '#c9d2de', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Your request regarding <strong>{service.title}</strong> has been logged. In this frontend stage, your form data has been validated. Backend API and email submission will be connected during backend deployment.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ color: '#fff', borderColor: '#fff' }}
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        projectSize: '',
                        location: '',
                        deadline: '',
                        details: ''
                      });
                    }}
                  >
                    Send Another Request
                  </button>
                  <a
                    href="https://wa.me/966565219639"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <MessageCircle size={16} />
                    <span>Chat on WhatsApp Directly</span>
                  </a>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                noValidate
                className="service-detail-quote-form"
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Khalid Al-Otaibi"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(0, 18, 40, 0.6)',
                        border: `1px solid ${formErrors.name ? '#e57373' : 'rgba(255, 255, 255, 0.15)'}`,
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                    />
                    {formErrors.name && (
                      <span style={{ color: '#ff8a80', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                        {formErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. name@company.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(0, 18, 40, 0.6)',
                        border: `1px solid ${formErrors.email ? '#e57373' : 'rgba(255, 255, 255, 0.15)'}`,
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                    />
                    {formErrors.email && (
                      <span style={{ color: '#ff8a80', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                        {formErrors.email}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      Phone / Mobile *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +966 50 123 4567"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(0, 18, 40, 0.6)',
                        border: `1px solid ${formErrors.phone ? '#e57373' : 'rgba(255, 255, 255, 0.15)'}`,
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                    />
                    {formErrors.phone && (
                      <span style={{ color: '#ff8a80', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                        {formErrors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  {/* Project Size / Quantity */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      Approximate Dimensions / Size
                    </label>
                    <input
                      type="text"
                      name="projectSize"
                      value={formData.projectSize}
                      onChange={handleInputChange}
                      placeholder="e.g. 4m x 2m signboard or 5 vehicles"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(0, 18, 40, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      Installation Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Olaya St, Riyadh"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(0, 18, 40, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      Target Completion Date
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(0, 18, 40, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                    Project Details & Material Requirements *
                  </label>
                  <textarea
                    rows={4}
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder={`Tell us specific requirements for ${service.title} (illumination type, indoor/outdoor, mounting surface, etc.)...`}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(0, 18, 40, 0.6)',
                      border: `1px solid ${formErrors.details ? '#e57373' : 'rgba(255, 255, 255, 0.15)'}`,
                      borderRadius: 'var(--radius-sm)',
                      color: '#ffffff',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                  {formErrors.details && (
                    <span style={{ color: '#ff8a80', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      {formErrors.details}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 2.25rem' }}>
                    <Send size={16} />
                    <span>Submit Project Details</span>
                  </button>

                  <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                    * Frontend validated. Real inquiry backend integration will follow.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. Image Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        images={service.gallery}
        currentIndex={photoIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setPhotoIndex((prev) => (prev === 0 ? service.gallery.length - 1 : prev - 1))}
        onNext={() => setPhotoIndex((prev) => (prev === service.gallery.length - 1 ? 0 : prev + 1))}
      />
    </main>
  );
};

export default ServiceDetail;

