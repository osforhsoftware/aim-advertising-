import React from 'react';
import { Link } from 'react-router-dom';

const showcaseItems = [
  {
    id: 1,
    title: 'KUDU Storefront Signage',
    image: '/assets/services/signages-1.webp',
    link: '/services/signages',
  },
  {
    id: 2,
    title: 'Aramco Exhibition Booth & Digital LED',
    image: '/assets/services/signages-3.webp',
    link: '/services/led-panel-screen-rental',
  },
  {
    id: 3,
    title: 'Chanel Luxury Retail Architecture',
    image: '/assets/services/signages-2.webp',
    link: '/services/indoor-outdoor-branding',
  },
  {
    id: 4,
    title: 'Crispy Pollo Storefront 3D Signage',
    image: '/assets/services/signages-4.webp',
    link: '/services/signages',
  },
];

const ShowcaseGallery = () => {
  return (
    <section style={{ padding: '2rem 0', backgroundColor: '#f0f2f4' }}>
      <div className="container">
        <div
          className="showcase-gallery-wrapper"
          style={{
            backgroundColor: '#1e2942',
            borderRadius: '28px',
            padding: '2.5rem',
            boxShadow: '0 12px 35px rgba(30, 41, 66, 0.15)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.25rem',
            }}
            className="showcase-gallery-grid"
          >
            {showcaseItems.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                style={{
                  display: 'block',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '240px',
                  backgroundColor: '#111a2e',
                  textDecoration: 'none',
                }}
                className="showcase-card"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .showcase-gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 575px) {
          .showcase-gallery-wrapper {
            padding: 1rem !important;
            border-radius: 18px !important;
          }
          .showcase-gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .showcase-card {
            height: 135px !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ShowcaseGallery;

