import React, { useState, useEffect } from 'react';

const clientLogos = [
  { id: 1, name: 'Grand Hyper', logo: '/assets/clients/grand-hyper.png' },
  { id: 2, name: 'GIANFRANCO FERRE MILANO', logo: '/assets/clients/gianfranco.png' },
  { id: 3, name: 'Café Bateel', logo: '/assets/clients/cafe-bateel.png' },
  { id: 4, name: 'BEAUTY SECRETS', logo: '/assets/clients/beauty-secret.png' },
  { id: 5, name: 'BALMAIN', logo: '/assets/clients/balmain.png' },
  { id: 6, name: 'GSC GOLDEN SOLUTIONS CO.', logo: '/assets/clients/gsc.png' },
  { id: 7, name: 'CHANEL', logo: '/assets/clients/chanel.png' },
  { id: 8, name: 'GUCCI', logo: '/assets/clients/gucci.png' },
  { id: 9, name: 'Tim Hortons', logo: '/assets/clients/tim-hortons.png' },
  { id: 10, name: 'KUDU', logo: '/assets/clients/kudu.png' },
  { id: 11, name: 'Pierre Cardin', logo: '/assets/clients/pierre-cardin.png' },
  { id: 12, name: 'Dahua Technology', logo: '/assets/clients/dahua.png' },
  { id: 13, name: 'Brandton', logo: '/assets/clients/brandton.png' },
  { id: 14, name: 'D-Haus', logo: '/assets/clients/d-haus.png' },
  { id: 15, name: 'Rokny', logo: '/assets/clients/rokny.png' },
];

const ClientLogos = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isPaused, setIsPaused] = useState(false);

  // Adjust visible logos per viewport cleanly
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 575) {
        setVisibleCount(2);
      } else if (window.innerWidth <= 991) {
        setVisibleCount(3);
      } else {
        setVisibleCount(6);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // 15 logos - 6 visible = 9 steps -> 10 positions (0..9) matching the 10 dots
  const maxIndex = Math.max(0, clientLogos.length - visibleCount);
  const dotCount = maxIndex + 1;

  // Keep activeIndex within valid range on resize
  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Smooth auto-play carousel (pauses on hover)
  useEffect(() => {
    if (isPaused || maxIndex === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  return (
    <section style={{ padding: '2rem 0', backgroundColor: '#f0f2f4' }}>
      <div className="container">
        <div
          className="client-logos-card"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            padding: '3.5rem 2.5rem 2.5rem',
            boxShadow: '0 10px 35px rgba(0, 24, 55, 0.06)',
            border: '1px solid #eef2f6',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              color: '#001837',
              fontSize: '2.5rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading, "Quicksand", sans-serif)',
              marginBottom: '2.25rem',
            }}
          >
            Our Clients
          </h2>

          {/* Smooth Sliding Carousel Viewport */}
          <div
            style={{
              overflow: 'hidden',
              width: 'calc(100% + 20px)',
              marginLeft: '-10px',
              padding: '8px 0 22px',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                transform: `translateX(-${(activeIndex * 100) / visibleCount}%)`,
                transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform',
              }}
            >
              {clientLogos.map((client) => (
                <div
                  key={client.id}
                  style={{
                    flex: `0 0 ${100 / visibleCount}%`,
                    boxSizing: 'border-box',
                    padding: '0 10px',
                  }}
                >
                  <div
                    className="client-logo-box"
                    title={client.name}
                  >
                    <img
                      src={client.logo}
                      alt={client.name}
                      loading="lazy"
                      style={{
                        maxHeight: '50px',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Carousel Indicator Dots */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {Array.from({ length: dotCount }).map((_, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  style={{
                    width: isActive ? '22px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    backgroundColor: isActive ? '#001837' : '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s ease',
                  }}
                  aria-label={`Show clients slide ${i + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .client-logo-box {
          background-color: #f7f9fb;
          border: 1px solid #edf2f7;
          border-radius: 20px;
          height: 125px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .client-logo-box:hover {
          background-color: #ffffff;
          box-shadow: 0 8px 25px rgba(0, 24, 55, 0.08);
          transform: translateY(-4px);
        }
        @media (max-width: 640px) {
          .client-logos-card {
            padding: 2.5rem 1.25rem 2rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ClientLogos;
