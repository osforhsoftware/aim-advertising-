import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ title, parentLink, parentLabel, activeLabel, customBg }) => {
  const bgImg = customBg || '/assets/images/titlebar-bg.jpg';

  return (
    <div
      className="pbmit-title-bar-wrapper"
      style={{
        position: 'relative',
        minHeight: '360px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#001837',
        color: '#ffffff',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Dark overlay matching Xcleen theme */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 24, 55, 0.72)',
          zIndex: 1,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, padding: '3.5rem 1.25rem' }}>
        <h1
          className="pbmit-tbar-title"
          style={{
            color: '#ffffff',
            fontSize: '3rem',
            lineHeight: 1.2,
            fontFamily: 'var(--font-heading, "Quicksand", sans-serif)',
            fontWeight: 700,
            marginBottom: '0.85rem',
            textTransform: 'capitalize',
            letterSpacing: '-0.5px',
          }}
        >
          {title}
        </h1>

        <nav
          aria-label="Breadcrumb navigation"
          className="pbmit-breadcrumb"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body, "Open Sans", sans-serif)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          <Link
            to="/"
            style={{
              color: '#ffffff',
              transition: 'color 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#31a49c')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
          >
            Home
          </Link>

          <ChevronRight size={14} color="#31a49c" />

          {parentLink && parentLabel ? (
            <>
              <Link
                to={parentLink}
                style={{
                  color: '#ffffff',
                  transition: 'color 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#31a49c')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                {parentLabel}
              </Link>
              <ChevronRight size={14} color="#31a49c" />
            </>
          ) : null}

          <span style={{ color: '#31a49c', fontWeight: 600 }}>{activeLabel || title}</span>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;

