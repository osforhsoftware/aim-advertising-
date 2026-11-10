import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import Advantages from '../components/home/Advantages';
import StatCounters from '../components/home/StatCounters';
import ClientLogos from '../components/home/ClientLogos';
import { Target, Eye, ArrowRight, ShieldCheck, Award } from 'lucide-react';

const About = () => {
  useEffect(() => {
    document.title = 'About Us - AIM Advertising';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <Breadcrumb title="About Us" activeLabel="About Us" />

      {/* Company Introduction Section */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: '4rem',
              alignItems: 'center'
            }}
          >
            <div>
              <span className="section-kicker">Who We Are</span>
              <h2 className="section-heading" style={{ marginBottom: '1.5rem' }}>
                AIM INTERNATIONAL ADVERTISING COMPANY
              </h2>
              <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '1.25rem' }}>
                We are a team of dynamic professionals committed to creating and manufacturing innovative and unique branding solutions for our diverse set of clientele. Our services are tailored to help maximize brand recognition and thereby achieve the branding goals of our clientele.
              </p>
              <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '2rem' }}>
                We are extremely proud to have grown into a well-established, highly recommended, reputable, industry leader in design, all-round printing, and signage company having branches in Riyadh and Dubai.
              </p>

              {/* Core Value highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <ShieldCheck size={28} color="#31a49c" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1.0625rem', color: 'var(--color-secondary)', margin: '0 0 0.25rem 0' }}>
                      Quality Standards
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                      Engineered for high desert temperatures and durability.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Award size={28} color="#31a49c" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1.0625rem', color: 'var(--color-secondary)', margin: '0 0 0.25rem 0' }}>
                      Turnkey Execution
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                      From CAD structural drawings to on-site installation.
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/contact-us" className="btn btn-primary">
                <span>Connect With Us</span>
                <ArrowRight size={16} className="btn-arrow-icon" />
              </Link>
            </div>

            {/* Side Image */}
            <div style={{ position: 'relative' }}>
              <img
                src="/assets/images/about-hero.jpg"
                alt="AIM International Advertising Company"
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section style={{ backgroundColor: 'var(--color-light-bg)', padding: '5rem 0' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-kicker">Guiding Principles</span>
            <h2 className="section-heading">Our Mission & Vision</h2>
            <p className="section-subtitle">
              Pioneering cutting-edge advertising techniques while upholding exceptional craftsmanship and long-term customer partnerships.
            </p>
          </div>

          <div className="grid-2">
            {/* Mission Card */}
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '3rem 2.5rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                borderLeft: '5px solid var(--color-primary)'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <Target size={30} color="#31a49c" />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                Our Mission
              </h3>
              <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', color: 'var(--color-text)', margin: 0 }}>
                We have a mission of keeping aligned with the client goals for every single business opportunity. Quality of service, cost efficiency, and sticking to timelines are the unique advantages that we provide.
              </p>
            </div>

            {/* Vision Card */}
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '3rem 2.5rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                borderLeft: '5px solid var(--color-secondary)'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(35, 46, 86, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <Eye size={30} color="#232e56" />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                Our Vision
              </h3>
              <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', color: 'var(--color-text)', margin: 0 }}>
                Our Vision is to be on the top in the market for which we are following all the technologies concerned & available for our business services to be up-to-date, and we are looking forward to the future in order to serve our clients in the most succeeding way.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatCounters />
      <Advantages />
      <ClientLogos />
    </main>
  );
};

export default About;

