import React from 'react';
import { Link } from 'react-router-dom';
import { useCountUp } from '../../hooks/useCountUp';
import '../../styles/evaluationStrip.css';

/**
 * Vector artwork matching the navy "FREE EVALUATION" mind-map card from aimiac.com
 */
const FreeEvaluationGraphic = () => (
  <svg
    className="evaluation-svg"
    viewBox="0 0 420 250"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Free Evaluation for Signage, Sticker Work, Acrylic, Vehicles Branding, and Indoor & Outdoor Branding"
  >
    {/* Center Title: FREE EVALUATION */}
    <g transform="translate(210, 114) rotate(-3)">
      <text
        x="0"
        y="-8"
        textAnchor="middle"
        fill="#fbbf24"
        fontFamily="'Quicksand', 'Segoe UI', sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="30"
        letterSpacing="0.5"
      >
        FREE
      </text>
      <text
        x="0"
        y="24"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="'Quicksand', 'Segoe UI', sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="24"
        letterSpacing="0.5"
      >
        EVALUATION
      </text>
      {/* Subtle yellow hand-drawn underline */}
      <path
        d="M -68 33 Q 0 28 70 33"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </g>

    {/* 1. Arrow & Label: Top-Left -> SIGNAGE */}
    <path
      d="M 155 82 Q 145 50 118 36"
      stroke="#fbbf24"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
    <path
      d="M 127 33 L 116 35 L 122 44"
      stroke="#fbbf24"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="95"
      y="30"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Quicksand', sans-serif"
      fontWeight="700"
      fontSize="14.5"
    >
      SIGNAGE
    </text>
    <path d="M 60 22 L 54 18 M 62 14 L 60 8 M 126 16 L 131 11" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />

    {/* 2. Arrow & Label: Top-Right -> STICKER WORK */}
    <path
      d="M 262 84 Q 275 56 298 44"
      stroke="#fbbf24"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
    <path
      d="M 289 41 L 300 43 L 294 52"
      stroke="#fbbf24"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="336"
      y="32"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Quicksand', sans-serif"
      fontWeight="700"
      fontSize="14"
    >
      STICKER
    </text>
    <text
      x="336"
      y="49"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Quicksand', sans-serif"
      fontWeight="700"
      fontSize="14"
    >
      WORK
    </text>
    <path d="M 304 16 L 299 10 M 370 22 L 377 18" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />

    {/* 3. Arrow & Label: Mid-Left -> ACRYLIC */}
    <path
      d="M 134 118 Q 100 116 74 132"
      stroke="#fbbf24"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
    <path
      d="M 80 123 L 72 133 L 84 134"
      stroke="#fbbf24"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="56"
      y="156"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Quicksand', sans-serif"
      fontWeight="700"
      fontSize="14.5"
    >
      ACRYLIC
    </text>
    <path d="M 22 146 L 16 142 M 23 158 L 16 160" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />

    {/* 4. Arrow & Label: Bottom-Center -> VEHICLES BRANDING */}
    <path
      d="M 205 154 Q 202 174 195 190"
      stroke="#fbbf24"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
    <path
      d="M 190 181 L 194 192 L 203 185"
      stroke="#fbbf24"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="194"
      y="211"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Quicksand', sans-serif"
      fontWeight="700"
      fontSize="13.5"
    >
      VEHICLES
    </text>
    <text
      x="194"
      y="228"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Quicksand', sans-serif"
      fontWeight="700"
      fontSize="13.5"
    >
      BRANDING
    </text>
    <path d="M 152 214 L 145 216 M 236 214 L 243 216" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />

    {/* 5. Arrow & Label: Bottom-Right -> INDOOR & OUTDOOR BRANDING */}
    <path
      d="M 284 124 Q 320 124 342 142"
      stroke="#fbbf24"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
    <path
      d="M 332 142 L 343 144 L 340 133"
      stroke="#fbbf24"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="354"
      y="167"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Quicksand', sans-serif"
      fontWeight="700"
      fontSize="12.5"
    >
      INDOOR &amp;
    </text>
    <text
      x="354"
      y="183"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Quicksand', sans-serif"
      fontWeight="700"
      fontSize="12.5"
    >
      OUTDOOR
    </text>
    <text
      x="354"
      y="199"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Quicksand', sans-serif"
      fontWeight="700"
      fontSize="12.5"
    >
      BRANDING
    </text>
    <path d="M 392 178 L 399 175 M 392 192 L 399 195" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const EvaluationStrip = () => {
  const { ref: counterCardRef, value: count } = useCountUp(520, 1800);

  return (
    <section className="evaluation-strip-section" aria-label="Free Evaluation and Staff Highlights">
      <div className="evaluation-strip-container">
        <div className="evaluation-strip-grid">
          {/* Left Card: Free Evaluation */}
          <Link
            to="/contact-us"
            className="evaluation-card-navy"
            title="Request a Free Evaluation"
          >
            <FreeEvaluationGraphic />
          </Link>

          {/* Center Card: Animated 520+ Teal Counter */}
          <div ref={counterCardRef} className="evaluation-card-teal">
            <div className="evaluation-counter-wrap" aria-label="520+ Professional and Experienced staff">
              <span className="evaluation-counter-digits">{count}</span>
              <span className="evaluation-counter-plus">+</span>
            </div>
            <p className="evaluation-counter-caption">
              Professional and Experienced staff ready to help you
            </p>
          </div>

          {/* Right Card: Free Evaluation */}
          <Link
            to="/contact-us"
            className="evaluation-card-navy"
            title="Request a Free Evaluation"
          >
            <FreeEvaluationGraphic />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EvaluationStrip;

