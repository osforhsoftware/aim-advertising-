import React from 'react';
import { Link } from 'react-router-dom';

const SolutionsCta = () => {
  return (
    <section style={{ padding: '2rem 0 4rem', backgroundColor: '#f0f2f4' }}>
      <div className="container">
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '3.5rem',
            boxShadow: '0 10px 35px rgba(0, 24, 55, 0.06)',
            border: '1px solid #eef2f6',
          }}
          className="solutions-cta-card"
        >
          <h2
            style={{
              color: '#31a49c',
              fontSize: '2.35rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading, "Quicksand", sans-serif)',
              marginBottom: '1.5rem',
              lineHeight: 1.3,
            }}
          >
            Complete Advertising Solutions in Riyadh
          </h2>

          <p
            style={{
              color: '#565656',
              fontSize: '1rem',
              lineHeight: '1.85',
              marginBottom: '2.25rem',
              fontFamily: 'var(--font-body, "Open Sans", sans-serif)',
            }}
          >
            From creative branding and professional signage to high-quality printing and customized advertising, we provide complete solutions to help your business stand out. As the Best Advertising Company in Riyadh, AIM Advertising delivers innovative branding and advertising services tailored to your brand’s unique needs. Our team focuses on quality, creativity, and professional execution, making us the Best Advertising Company in Riyadh for businesses looking to build a strong and memorable brand presence. Choose the Best Advertising Company in Riyadh for reliable branding, signage, printing, and advertising solutions.
          </p>

          <Link
            to="/services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#31a49c',
              color: '#ffffff',
              padding: '0.85rem 1.85rem',
              borderRadius: '8px',
              fontFamily: 'var(--font-heading, "Quicksand", sans-serif)',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 15px rgba(49, 164, 156, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#27857e';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#31a49c';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Explore Our Services →</span>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .solutions-cta-card {
            padding: 1.75rem 1.35rem !important;
            border-radius: 18px !important;
          }
          .solutions-cta-card h2 {
            font-size: 1.6rem !important;
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SolutionsCta;
