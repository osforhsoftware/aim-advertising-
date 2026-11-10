import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote:
      'AIM Advertising delivered top-tier 3D channel letters and illuminated storefront signage for our commercial complex in Riyadh. From design consultation to city permitting and flawless on-site installation, their craftsmanship was exceptional.',
    author: 'Sarah Al-Otaibi',
    role: 'Customer',
    rating: 5,
    avatar: '/assets/images/testimonial-avatar.jpg',
  },
  {
    id: 2,
    quote:
      'We entrusted AIM Advertising with full commercial vehicle fleet branding and our Riyadh showroom fit-out. Their attention to desert climate durability, color calibration, and prompt delivery exceeded all our corporate expectations.',
    author: 'Fahad Al-Husseini',
    role: 'Ceo & Founder',
    rating: 5,
    avatar: '/assets/images/testimonial-avatar.jpg',
  },
];

const TestimonialSlider = () => {
  return (
    <section style={{ padding: '3.5rem 0 2.5rem', backgroundColor: '#f0f2f4' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
          }}
          className="testimonials-grid"
        >
          {testimonials.map((item) => (
            <div key={item.id} className="pbmit-testimonial-style-2">
              <div>
                {/* Star Rating */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem' }}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>

                {/* Quote Text */}
                <p
                  style={{
                    fontSize: '1.05rem',
                    lineHeight: '1.8',
                    color: '#475569',
                    fontFamily: 'var(--font-body, "Open Sans", sans-serif)',
                    marginBottom: '2rem',
                  }}
                >
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info (Screenshot 5: Role visible on left, avatar inside cutout notch on right) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading, "Quicksand", sans-serif)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#001837',
                    }}
                  >
                    {item.author}
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      fontWeight: 500,
                      marginTop: '0.15rem',
                    }}
                  >
                    {item.role}
                  </div>
                </div>

                {/* Xcleen Style-2 Cutout Tab for Avatar */}
                <div className="pbmit-featured-img-wrapper">
                  <img src={item.avatar} alt={item.author} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialSlider;
