import React, { useEffect } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import IntroSection from '../components/home/IntroSection';
import EvaluationStrip from '../components/home/EvaluationStrip';
import MarqueeTicker from '../components/home/MarqueeTicker';
import FocusStory from '../components/home/FocusStory';
import Advantages from '../components/home/Advantages';
import HomeServices from '../components/home/HomeServices';
import StatCounters from '../components/home/StatCounters';
import TestimonialSlider from '../components/home/TestimonialSlider';
import ClientLogos from '../components/home/ClientLogos';
import ShowcaseGallery from '../components/home/ShowcaseGallery';
import SolutionsCta from '../components/home/SolutionsCta';

const Home = () => {
  useEffect(() => {
    document.title = 'Best Advertising Company in Riyadh | AIM Advertising';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main style={{ backgroundColor: '#f0f2f4' }}>
      {/* 1. Hero Showcase Slider */}
      <HeroSlider />

      {/* 2. Welcome & Company Overview */}
      <IntroSection />

      {/* 3. Core Advantages (Elevate Your Brand Visibility) */}
      <Advantages />

      {/* 4. Outlined Infinite Marquee Ticker */}
      <MarqueeTicker />

      {/* 5. Innovative Branding Experts Focus Story */}
      <FocusStory />

      {/* 5.5. Free Evaluation & 520+ Staff Highlight Strip */}
      <EvaluationStrip />

      {/* 6. Complete Services Showcase */}
      <HomeServices />

      {/* 7. Key Statistics Counters */}
      <StatCounters />

      {/* 8. Testimonials */}
      <TestimonialSlider />

      {/* 9. Client Logos Card */}
      <ClientLogos />

      {/* 10. Dark Navy Showcase Gallery */}
      <ShowcaseGallery />

      {/* 11. Complete Advertising Solutions Card */}
      <SolutionsCta />
    </main>
  );
};

export default Home;
