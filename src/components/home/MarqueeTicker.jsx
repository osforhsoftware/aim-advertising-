import React from 'react';
import '../../styles/marqueeTicker.css';

const tickerKeywords = [
  'Cutting',
  'Signages',
  'Stickers',
  'Branding',
  'Printing',
  'Fabrication',
  'Vehicle Branding',
  'Acrylic',
  'Display Stands',
  'Offset Printing',
  'Screen Printing'
];

const MarqueeTicker = () => {
  return (
    <div className="marquee-ticker-wrap" aria-hidden="true">
      <div className="marquee-ticker-track">
        {/* Repeating sequence for smooth seamless infinite loop */}
        {[...tickerKeywords, ...tickerKeywords, ...tickerKeywords].map((item, index) => (
          <div key={index} className="marquee-ticker-item">
            <span className="marquee-ticker-text">{item}</span>
            <span className="marquee-ticker-star">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeTicker;
