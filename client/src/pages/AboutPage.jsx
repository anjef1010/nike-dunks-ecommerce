import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AboutPage.css';

const AboutPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const navigate = useNavigate();

  return (
    <div className="about-luxury-page">
      {/* 1. Hero Section */}
      <section className="about-hero-full">
        <div className="hero-content-center">
          <span className="reveal-tag">Est. 2020 — Bangkok To Global</span>
          <h1 className="hero-main-title">The Master <br/>Grade Standard</h1>
          
          <div className="glass-stats-container">
            <div className="stat-item">
              <h3>50k+</h3>
              <p>Verified</p>
            </div>
            <div className="stat-item">
              <h3>1:1</h3>
              <p>Accuracy</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Support</p>
            </div>
          </div>

          <div className="scroll-indicator">
            <div className="mouse"></div>
            <span>Scroll to Explore</span>
          </div>
        </div>
      </section>

      {/* 2. Narrative Section */}
      <section className="narrative-section">
        <div className="container-narrow">
          <div className="narrative-grid">
            <div className="narrative-text">
              <span className="gold-label">Our Journey</span>
              <h2>We chose the road less traveled.</h2>
              <p>The sneaker market is broken. We fixed it by sourcing master-grade editions directly from artisanal workshops in Thailand.</p>
            </div>
            <div className="thailand-workshop-bg">
               <div className="image-caption">Bangkok Artisans</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Comparison Section */}
      <section className="comparison-vault">
        <div className="luxury-container">
          <h2 className="serif-title">Indistinguishable Truth</h2>
          <div className="gold-underline"></div>

          <div className="comparison-layout">
            <div className="comp-card">
              <div className="retail-image-bg">
                <span className="tag-label">Retail Reference</span>
              </div>
              <p className="comp-text">Standard Retail Stitching</p>
            </div>

            <div className="vs-divider">
              <span className="vs-text">VS</span>
            </div>

            <div className="comp-card">
              <div className="master-image-bg">
                <span className="tag-label gold">Our Master-Grade</span>
              </div>
              <p className="comp-text">Thailand High-Copy Precision</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="about-footer-cta">
        <div className="cta-box">
          <h2 className="serif-title white">Step Into Excellence</h2>
          <button className="btn-gold-fill" onClick={() => navigate('/collection')}>
            Shop The Collection
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;