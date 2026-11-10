import React from 'react';
import '../../styles/introBanner.css';

const IntroSection = () => {
  return (
    <section className="welcome-banner-section" aria-label="Welcome and Company Overview">
      <div className="container">
        <div className="welcome-banner-card">
          {/* Top-left decorative soft circle */}
          <div className="welcome-banner-circle-decor" aria-hidden="true" />

          {/* Two-column layout matching design */}
          <div className="welcome-banner-grid">
            {/* Left: Bold Heading */}
            <h2 className="welcome-banner-heading">
              Best Advertising Company in Riyadh for Complete Branding Solutions
            </h2>

            {/* Right: Paragraphs */}
            <div className="welcome-banner-text">
              <p className="welcome-banner-p">
                AIM Advertising is a Best Advertising Company in Riyadh, providing professional branding, signage, printing, and advertising solutions for businesses across Riyadh. We help brands create a strong visual identity through creative ideas, quality execution, and customized advertising solutions.
              </p>
              <p className="welcome-banner-p">
                From custom signage and vehicle branding to printing, promotional materials, and business branding, we deliver solutions designed to make your brand more visible, professional, and memorable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
