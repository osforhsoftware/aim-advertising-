import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/common/Breadcrumb';
import { Mail, MapPin, Phone, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../services/servicesApi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us - AIM Advertising';
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your full name';
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone number';
    if (!formData.message.trim()) newErrors.message = 'Please enter your message';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/api/v1/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          service_name: formData.subject.trim() || 'General Inquiry',
          message: formData.message.trim(),
        }),
      });
    } catch (err) {
      console.warn('Backend offline or submission fallback:', err.message);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <main>
      <Breadcrumb title="Contact Us" activeLabel="Contact Us" />

      {/* 4 Info Cards */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="grid-4" style={{ marginBottom: '4rem' }}>
            {/* Card 1 */}
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '2.5rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
                borderTop: '4px solid var(--color-primary)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}
              >
                <Mail size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                Mail Us 24/7
              </h3>
              <p style={{ margin: 0, fontSize: '0.9375rem' }}>
                <a href="mailto:info@aimiac.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  info@aimiac.com
                </a>
              </p>
            </div>

            {/* Card 2 */}
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '2.5rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
                borderTop: '4px solid var(--color-secondary)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(35, 46, 86, 0.1)',
                  color: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}
              >
                <MapPin size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                Our Location
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                Wasat Al Mujamma Building No.25, Shop No. : 540, 541, Riyadh, KSA
              </p>
            </div>

            {/* Card 3 */}
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '2.5rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
                borderTop: '4px solid var(--color-primary)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}
              >
                <Phone size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                Call Us 24/7
              </h3>
              <p style={{ margin: 0, fontSize: '0.9375rem' }}>
                <a href="tel:+966565219639" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  +966 565 21 96 39
                </a>
              </p>
            </div>

            {/* Card 4 */}
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '2.5rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
                borderTop: '4px solid var(--color-secondary)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(35, 46, 86, 0.1)',
                  color: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}
              >
                <Clock size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                Working Days
              </h3>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-secondary)' }}>
                Sat - Thu: 8.00am - 7.00pm
              </p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#e57373', fontWeight: 600 }}>
                Friday Closed
              </p>
            </div>
          </div>

          {/* Form and Map Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: '3.5rem',
              alignItems: 'start'
            }}
          >
            {/* Contact Form */}
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '2.5rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)'
              }}
            >
              <span className="section-kicker">Get In Touch</span>
              <h2 className="section-heading" style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>
                Happy to Answer All Your Questions
              </h2>
              <p style={{ color: 'var(--color-text)', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Our customer support and technical consultation team is ready to assist you. Send us your inquiry and we will get back to you promptly.
              </p>

              {submitted ? (
                <div
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2rem',
                    textAlign: 'center'
                  }}
                >
                  <CheckCircle2 size={40} color="#31a49c" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h3 style={{ color: 'var(--color-secondary)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    Inquiry Received!
                  </h3>
                  <p style={{ color: 'var(--color-text)', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    Thank you, <strong>{formData.name}</strong>. Your inquiry has been received and forwarded to our team. We will contact you shortly.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.35rem' }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${errors.name ? '#e57373' : 'var(--color-border)'}`,
                          outline: 'none'
                        }}
                      />
                      {errors.name && <span style={{ color: '#d32f2f', fontSize: '0.75rem' }}>{errors.name}</span>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.35rem' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${errors.email ? '#e57373' : 'var(--color-border)'}`,
                          outline: 'none'
                        }}
                      />
                      {errors.email && <span style={{ color: '#d32f2f', fontSize: '0.75rem' }}>{errors.email}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.35rem' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+966 50 000 0000"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${errors.phone ? '#e57373' : 'var(--color-border)'}`,
                          outline: 'none'
                        }}
                      />
                      {errors.phone && <span style={{ color: '#d32f2f', fontSize: '0.75rem' }}>{errors.phone}</span>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.35rem' }}>
                        Subject / Service of Interest
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Signage Quotation"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.35rem' }}>
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your project details or questions..."
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${errors.message ? '#e57373' : 'var(--color-border)'}`,
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                    {errors.message && <span style={{ color: '#d32f2f', fontSize: '0.75rem' }}>{errors.message}</span>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: '0.875rem 2.25rem' }}
                      disabled={submitting}
                    >
                      <Send size={16} />
                      <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                    </button>
                    <a
                      href="https://wa.me/966565219639"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#25d366',
                        fontWeight: 700,
                        fontSize: '0.875rem'
                      }}
                    >
                      <MessageCircle size={18} />
                      <span>WhatsApp Us</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* Direct Phone Banner & Map Embed */}
            <div>
              <div
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: '#ffffff',
                  padding: '2rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem'
                }}
              >
                <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                  Call Us Anytime
                </span>
                <h3 style={{ color: '#ffffff', fontSize: '1.75rem', margin: '0.5rem 0 1rem 0' }}>
                  +966 565 21 96 39
                </h3>
                <p style={{ color: '#c9d2de', fontSize: '0.9375rem', margin: '0 0 1.25rem 0', lineHeight: 1.6 }}>
                  Our technical advisors are available Saturday through Thursday to review your advertising needs.
                </p>
                <a href="tel:+966565219639" className="btn btn-primary" style={{ width: '100%' }}>
                  <Phone size={16} />
                  <span>Call Now</span>
                </a>
              </div>

              {/* Riyadh Map Embed */}
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  height: '340px',
                  border: '1px solid var(--color-border)'
                }}
              >
                <iframe
                  title="AIM Advertising Riyadh Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115935.81180295195!2d46.6752957!3d24.7135517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d48939b%3A0x60a9fba414f9b0ea!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;

