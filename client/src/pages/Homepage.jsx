import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import '../css/HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        setFeaturedProducts(response.data.products || response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch products';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const features = [
    { icon: '01', title: 'Premium Quality', description: 'Authentic Nike Dunks' },
    { icon: '02', title: 'Fast Shipping', description: 'Express delivery globally' },
    { icon: '03', title: 'Secure Shopping', description: '100% Buyer Protection' },
    { icon: '04', title: 'Easy Returns', description: '30-day hassle-free' },
  ];

  const testimonials = [
    { name: 'Alex Johnson', comment: 'Amazing quality and fast shipping! Perfect condition.', rating: 5 },
    { name: 'Sarah Chen', comment: 'Best sneaker store online. Authentic products.', rating: 5 },
    { name: 'Mike Rodriguez', comment: 'Great selection and competitive prices.', rating: 4 },
  ];

  return (
    <main className="home-page luxury-theme">
      {/* Hero Section - Background image is now handled in HomePage.css */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-label">Available Now — Exclusive Release</div>
          <h1 className="hero-title">
            Step Into <span className="highlight">Excellence</span>
          </h1>
          <p className="hero-subtitle">
            A curated selection of the most coveted silhouettes. Engineered for the culture, 
            sourced for the collector.
          </p>
          <div className="hero-buttons">
            <Link to="/collection" className="btn-luxury-primary">Explore Collection</Link>
            <Link to="/about" className="btn-luxury-ghost">Our Heritage</Link>
          </div>
          <div className="hero-stats-glass">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Editions</span>
            </div>
            <div className="stat-item-divider" />
            <div className="stat-item">
              <span className="stat-number">5K+</span>
              <span className="stat-label">Collectors</span>
            </div>
            <div className="stat-item-divider" />
            <div className="stat-item">
              <span className="stat-number">90%</span>
              <span className="stat-label">Repeat Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="luxury-container">
          <header className="luxury-header">
            <span className="subtitle-reveal">Limited Selection</span>
            <h2 className="luxury-title">The Curated Drop</h2>
          </header>

          {loading ? <Loader /> : error ? <Message type="danger">{error}</Message> : (
            <div className="luxury-grid">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div className="luxury-card" key={product._id}>
                  <Link to={`/product/${product._id}`} className="image-wrapper">
                    <img
                      src={product.image.startsWith('/') ? `${import.meta.env.VITE_API_URL}${product.image}` : product.image}
                      alt={product.name}
                    />
                    <div className="card-overlay">
                      <span>View Detail — {index + 1}/04</span>
                    </div>
                    {product.onSale && <div className="luxury-tag">Exclusive</div>}
                  </Link>
                  <div className="card-info">
                    <div className="info-top">
                      <h3>{product.name}</h3>
                      <p className="luxury-price">Rs. {product.price}</p>
                    </div>
                    <button 
                      className="minimal-add-btn"
                      onClick={() => console.log('Add to cart', product)}
                      disabled={product.countInStock === 0}
                    >
                      {product.countInStock === 0 ? 'Sold Out' : '+ Quick Add'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="compact-features">
        {features.map((f, i) => (
          <div key={i} className="compact-feature-item">
            <span className="feature-index">{f.icon}</span>
            <div className="feature-text">
              <h4>{f.title}</h4>
              <p>{f.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* About Section */}
      <section className="luxury-about">
        <div className="luxury-container">
          <div className="about-split">
            <div className="about-visual"> 
              <div className="about-img-main"></div> 
                <div className="about-experience-badge">
                   <span className="exp-year">Est. 2020</span>
                   <span className="exp-text">Defining the Culture</span>
                  </div>
                </div>
            <div className="about-narrative">
              <span className="subtitle-reveal">Our Heritage</span>
              <h2 className="luxury-title-left">Authenticity in Every Stitch</h2>
              <p className="narrative-p">
                We are more than a retailer; we are custodians of sneaker history. 
                Every pair in our collection undergoes a rigorous vetting process 
                to ensure you receive nothing but the genuine article.
              </p>
              <div className="luxury-stats-grid">
                <div className="l-stat">
                  <strong>100%</strong>
                  <span>Verified Authentic</span>
                </div>
                <div className="l-stat">
                  <strong>Global</strong>
                  <span>White-Glove Shipping</span>
                </div>
              </div>
              <button className="btn-luxury-outline" onClick={() => navigate('/about')}>
                Discover Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="marquee-testimonials">
        <div className="marquee-content">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="testimonial-snippet">
              <span className="star-luxury">★</span>
              <p>"{t.comment}" — <strong>{t.name}</strong></p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="luxury-newsletter">
        <div className="newsletter-wrapper">
          <div className="newsletter-text">
            <h2>Join the Inner Circle</h2>
            <p>Early access to limited drops. No spam, just excellence.</p>
          </div>
          <form className="minimal-form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Your email address" aria-label="email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default HomePage;