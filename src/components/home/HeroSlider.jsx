import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/hero.css';

const slides = [
  {
    id: 1,
    kicker: 'Best Advertising',
    title: 'Company in Riyadh',
    description:
      'A leading advertising company in Riyadh, Saudi Arabia, offering creative branding, signage, printing and advertising solutions that help your business stand out and grow.',
    primaryBtn: { text: 'Explore Services', link: '/services' },
    secondaryBtn: { text: 'Get a Quote', link: '/contact-us' },
    bgImage: '/assets/images/hero-slide1.jpg'
  },
  {
    id: 2,
    kicker: 'AIM Advertising',
    title: 'Make Your Brand Stand Out',
    description:
      'We deliver creative branding, premium signage, professional printing, and custom advertising solutions designed to give your business a stronger and more memorable presence.',
    primaryBtn: { text: 'Our Services', link: '/services' },
    secondaryBtn: { text: 'Contact Us', link: '/contact-us' },
    bgImage: '/assets/images/hero-slide2.png'
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="hero-slider" aria-label="Hero Showcase">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <div className="hero-bg-wrapper">
            <img
              src={slide.bgImage}
              alt={slide.title}
              className="hero-bg-image"
            />
            <div className="hero-overlay" />
          </div>

          <div className="container">
            <div className="hero-content">
              <span className="hero-kicker">{slide.kicker}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-description">{slide.description}</p>
              <div className="hero-buttons">
                <Link to={slide.primaryBtn.link} className="btn btn-primary">
                  <span>{slide.primaryBtn.text}</span>
                  <ArrowRight size={16} className="btn-arrow-icon" />
                </Link>
                <Link to={slide.secondaryBtn.link} className="btn btn-outline" style={{ color: '#fff', borderColor: '#fff' }}>
                  <span>{slide.secondaryBtn.text}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <button
        type="button"
        className="hero-nav-arrow hero-arrow-prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        type="button"
        className="hero-nav-arrow hero-arrow-next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Slide Indicators */}
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;

