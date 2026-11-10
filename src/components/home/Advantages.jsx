import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { advantagesData } from '../../data/advantagesData';
import '../../styles/advantages.css';

const Advantages = () => {
  return (
    <section className="advantages-section" aria-label="Why Choose AIM Advertising">
      <div className="container">
        <div className="advantages-layout">
          {/* Left Column: Heading + Know More Button */}
          <div className="advantages-left">
            <h2 className="advantages-title">
              Elevate Your Brand<br />
              Visibility with Our Saudi<br />
              Expertise
            </h2>
            <Link to="/about-us" className="advantages-know-more-btn">
              <span>Know More</span>
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* Right Column: 2x2 Frameless Features Grid */}
          <div className="advantages-grid">
            {advantagesData.map((adv) => (
              <div key={adv.id} className="advantage-item">
                <div className="advantage-icon-wrapper">
                  <img
                    src={adv.icon}
                    alt={adv.title}
                    className="advantage-icon-img"
                  />
                </div>
                <h3 className="advantage-title">{adv.title}</h3>
                <p className="advantage-desc">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
