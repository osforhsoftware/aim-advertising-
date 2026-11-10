import React from 'react';
import { statCountersData } from '../../data/advantagesData';
import { useCountUp } from '../../hooks/useCountUp';

const StatCounters = () => {
  const targets = statCountersData.map((item) => Number(item.digits) || 0);
  const { ref: gridRef, value: counts } = useCountUp(targets, 1800);

  return (
    <section className="fun-facts-section">
      <div className="container">
        {/* Top Header Divider */}
        <div className="fun-facts-divider">
          <span className="fun-facts-badge">FUN AND FACTS</span>
        </div>

        {/* 4-Column Stat Counters Grid */}
        <div ref={gridRef} className="fun-facts-grid">
          {statCountersData.map((item, idx) => (
            <div key={idx} className="fun-fact-item">
              <div
                className="fun-fact-number-wrap"
                aria-label={`${item.digits}${item.suffix}`}
              >
                <span className="fun-fact-digits">{counts[idx]}</span>
                <span className="fun-fact-suffix">{item.suffix}</span>
              </div>
              <p className="fun-fact-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatCounters;
