import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaShieldAlt, FaGem, FaShippingFast, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import '../css/ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeSystem, setSizeSystem] = useState('US'); 

  const sizeCharts = {
    men: {
      US: [7, 8, 9, 10, 11, 12],
      EU: [40, 41, 42, 43, 44, 45],
      UK: [6, 7, 8, 9, 10, 11]
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        if (data.success) {
          setProduct(data.product);
          // Fetch related products (matching category)
          const relatedRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
          const filtered = relatedRes.data.products
            .filter(p => p.category === data.product.category && p._id !== id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        setError('Failed to retrieve item details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if(!selectedSize) return toast.error("Please select a size");
    addToCart({ ...product, selectedSize, sizeSystem }, 1);
    toast.success(`${product.name} secured in vault.`);
  };

  if (loading) return <Loader />;

  return (
    <div className="master-grade-root">
      <nav className="luxury-nav">
        <button onClick={() => navigate(-1)} className="btn-back-minimal">
          <FaArrowLeft /> Return to Archive
        </button>
        <span className="gold-tag">Thailand Master Batch</span>
      </nav>

      <div className="editorial-main-grid">
        {/* Gallery Section - Now with restricted image size */}
        <section className="visual-display">
          <div className="curated-image-frame">
            <img 
              src={product.image.startsWith('/') ? `${import.meta.env.VITE_API_URL}${product.image}` : product.image} 
              alt={product.name} 
            />
          </div>
          <div className="visual-footer">
            <span>Reference: {product._id.substring(18)}</span>
            <span>Batch No: 2024-TH</span>
          </div>
        </section>

        {/* Info Sidebar */}
        <section className="intelligence-sidebar">
          <div className="sticky-content">
            <div className="product-identity">
              <span className="brand-series">{product.brand}</span>
              <h1 className="editorial-name">{product.name}</h1>
              <div className="price-display">Rs. {product.price?.toLocaleString()}</div>
            </div>

            <div className="vault-size-system">
               <div className="system-labels">
                  <label>Select Size</label>
                  <div className="toggles">
                    {['US', 'UK', 'EU'].map(s => (
                      <button key={s} className={sizeSystem === s ? 'active' : ''} onClick={() => setSizeSystem(s)}>{s}</button>
                    ))}
                  </div>
               </div>
               <div className="size-grid-master">
                 {sizeCharts.men[sizeSystem].map(size => (
                   <button
                     key={size}
                     className={`size-node ${selectedSize === size.toString() ? 'selected' : ''}`}
                     onClick={() => setSelectedSize(size.toString())}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>

            <button className="btn-vault-action" onClick={handleAddToCart} disabled={product.countInStock === 0}>
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Vault'}
            </button>

            <div className="trust-indicator-row">
              <div className="trust-cell"><FaShieldAlt /><span>Verified</span></div>
              <div className="trust-cell"><FaCheckCircle /><span>1:1 Ratio</span></div>
              <div className="trust-cell"><FaShippingFast /><span>Priority</span></div>
            </div>
          </div>
        </section>
      </div>

      {/* Technical Specs Section */}
      <section className="technical-specs-section">
        <div className="specs-header">
          <h2 className="specs-title">Technical Specifications</h2>
          <div className="specs-underline"></div>
        </div>
        <div className="specs-container">
          <div className="spec-card">
            <FaGem className="spec-icon" />
            <h4>Artisanal Leather</h4>
            <p>Top-grain calf leather treated in Bangkok to match original texture and durability.</p>
          </div>
          <div className="spec-card">
            <div className="spec-number">01</div>
            <h4>Stitch Precision</h4>
            <p>Hand-finished seams using original density patterns for a perfect silhouette.</p>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="related-section">
        <div className="section-title-wrap">
          <h2 className="serif-subtitle">The Collector's Suite</h2>
          <p>Similar master-grade exemplars you may appreciate.</p>
        </div>

        <div className="related-grid">
          {relatedProducts.map(item => (
            <Link to={`/product/${item._id}`} key={item._id} className="related-card">
              <div className="related-img-box">
                <img src={item.image.startsWith('/') ? `${import.meta.env.VITE_API_URL}${item.image}` : item.image} alt={item.name} />
              </div>
              <div className="related-info">
                <h4>{item.name}</h4>
                <span>Rs. {item.price.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse Collection Button */}
        <div className="browse-all-wrap">
          <Link to="/collection" className="btn-browse-collection">
            Browse Full Collection <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;