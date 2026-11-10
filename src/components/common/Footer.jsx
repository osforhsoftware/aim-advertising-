import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, MessageCircle } from 'lucide-react';
import '../../styles/footer.css';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="site-footer-wrapper">
        <div className="footer-card-container">
          <div className="footer-main-card">
            {/* Subtle decorative wave SVG in bottom-left (Screenshot 2) */}
            <svg
              className="footer-wave-decor"
              viewBox="0 0 400 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-50 150 C 50 100, 150 200, 250 140 C 350 80, 450 160, 500 120"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M-50 170 C 50 120, 150 220, 250 160 C 350 100, 450 180, 500 140"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M-50 190 C 50 140, 150 240, 250 180 C 350 120, 450 200, 500 160"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>

            <div className="footer-columns-grid">
              {/* Column 1: White Logo (Screenshot 2) */}
              <div className="footer-col col-brand">
                <Link to="/" className="footer-logo-link">
                  <img
                    src="/assets/images/logo-footer.png"
                    alt="AIM Advertising"
                    className="footer-logo-img"
                  />
                </Link>
              </div>

              {/* Column 2: Useful Link (Two Sub-Columns: Screenshot 2) */}
              <div className="footer-col col-links">
                <h4 className="footer-title">Useful Link</h4>
                <div className="useful-links-subgrid">
                  <div className="sub-links-col">
                    <Link to="/" className="footer-link">Home</Link>
                    <Link to="/" className="footer-link">Blog</Link>
                  </div>
                  <div className="sub-links-col">
                    <Link to="/about-us" className="footer-link">About</Link>
                    <Link to="/contact-us" className="footer-link">Contact</Link>
                  </div>
                </div>
              </div>

              {/* Column 3: Working Time (Screenshot 2) */}
              <div className="footer-col col-hours">
                <h4 className="footer-title">Working Time</h4>
                <div className="footer-info-text">
                  <p>Saturday - Thursday</p>
                  <p>8.00am - 7.00pm</p>
                  <p style={{ marginTop: '0.4rem', color: 'rgba(255,255,255,0.6)' }}>Friday Closed</p>
                </div>
              </div>

              {/* Column 4: Say Hello (Screenshot 2) */}
              <div className="footer-col col-contact">
                <h4 className="footer-title">Say Hello</h4>
                <div className="footer-info-text">
                  <p>Wasat Al Mujamma Building</p>
                  <p>No.25 Shop No. : 540,541</p>
                  <p>Riyadh,KSA</p>
                  <p style={{ marginTop: '0.5rem' }}>
                    <a href="tel:+966565219639" className="footer-link-active">+966565219639</a>
                  </p>
                  <p>
                    <a href="mailto:info@aimiac.com" className="footer-link-active">info@aimiac.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright section on white background underneath (Screenshot 2) */}
          <div className="footer-copyright-bar">
            Copyright © 2024 AIM INTERNATIONAL ADVERTISING COMPANY , All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons: WhatsApp & Scroll To Top (Screenshot 1, 2, 4) */}
      <div className="floating-widgets-wrapper">
        {showScrollTop && (
          <button
            type="button"
            className="floating-scroll-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ChevronUp size={22} color="#31a49c" />
          </button>
        )}

        <div className="floating-whatsapp-container">
          <div className="whatsapp-tooltip-pill">
            <span className="tooltip-line1">Need Help?</span>
            <span className="tooltip-line2">Chat with us</span>
          </div>
          <a
            href="https://wa.me/966565219639"
            target="_blank"
            rel="noopener noreferrer"
            className="floating-whatsapp-btn"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={28} color="#ffffff" fill="#ffffff" />
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
