import React from 'react';
import { Check } from 'lucide-react';
import '../../styles/focusStory.css';

const FocusStory = () => {
  return (
    <section className="focus-story-section" aria-label="Innovative Branding Experts">
      <div className="focus-story-container">
        <div className="focus-story-grid">
          {/* Left: Office / Exhibition Showcase Photo */}
          <div className="focus-story-image-wrap">
            <img
              src="/assets/images/about-focus.jpg"
              alt="Innovative Branding Experts | Best Advertising Company in Riyadh"
              className="focus-story-img"
            />
          </div>

          {/* Right: Polished Card with Story, Subheading & Checklist */}
          <div className="focus-story-card">
            <h2 className="focus-story-heading">
              Innovative Branding Experts | Best Advertising Company in Riyadh
            </h2>

            <p className="focus-story-desc">
              We are a team of dynamic professionals dedicated to crafting innovative and unique branding solutions for a diverse clientele. Our tailored services are designed to maximize brand recognition and help our clients achieve their branding goals effectively. As the Best Advertising Company in Riyadh, with branches in UAE and KSA, we have grown into a highly recommended industry leader in design, all-round printing, signage, and advertising solutions.
            </p>

            <h3 className="focus-story-subheading">
              Focus on your business — we handle advertising
            </h3>

            <p className="focus-story-secondary-desc">
              We carefully select and train our advertising team, so you can be confident that your brand will receive high-quality service and professional attention from the <strong>Best Advertising Company in Riyadh.</strong>
            </p>

            <div className="focus-story-checks">
              <div className="focus-story-check-item">
                <Check size={20} color="#31a49c" strokeWidth={2.5} className="focus-story-check-icon" />
                <span className="focus-story-check-text">
                  Experts Are Selected and Trained to deliver consistent results.
                </span>
              </div>
              <div className="focus-story-check-item">
                <Check size={20} color="#31a49c" strokeWidth={2.5} className="focus-story-check-icon" />
                <span className="focus-story-check-text">
                  All Work Is Monitored, including regular reviews and performance checks.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FocusStory;
