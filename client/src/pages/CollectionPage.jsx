import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import '../css/CollectionPage.css';

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState('featured');

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        if (data && Array.isArray(data.products)) setProducts(data.products);
      } catch (err) {
        setError('Collection currently unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleFilter = (val, list, setList) => {
    list.includes(val) ? setList(list.filter(i => i !== val)) : setList([...list, val]);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (searchText) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()));
    if (selectedBrands.length) filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    if (selectedCategories.length) filtered = filtered.filter(p => selectedCategories.includes(p.category));
    
    if (sortOption === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-high') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, searchText, selectedBrands, selectedCategories, sortOption]);

  const uniqueBrands = [...new Set(products.map(p => p.brand))].sort();
  const uniqueCategories = [...new Set(products.map(p => p.category))].sort();

  return (
    <div className="elite-collection-root">
      {/* Minimalist Title Section */}
      <div className="collection-header-elite">
        <div className="header-left">
          <span className="breadcrumb">Archive / Footwear</span>
          <h1 className="editorial-title">The Master-Grade Series</h1>
        </div>
        <div className="header-right">
          <select className="minimal-select" onChange={e => setSortOption(e.target.value)}>
            <option value="featured">Newest</option>
            <option value="price-low">Price: Low—High</option>
            <option value="price-high">Price: High—Low</option>
          </select>
        </div>
      </div>

      <div className="editorial-layout">
        {/* Minimalist Floating Sidebar */}
        <aside className="elite-sidebar">
          <div className="sidebar-section">
            <h4 className="section-label">Search</h4>
            <input 
              type="text" 
              className="elite-search" 
              placeholder="Keywords..." 
              onChange={e => setSearchText(e.target.value)}
            />
          </div>

          <div className="sidebar-section">
            <h4 className="section-label">Maison / Brand</h4>
            {uniqueBrands.map(brand => (
              <button 
                key={brand} 
                className={`filter-pill ${selectedBrands.includes(brand) ? 'active' : ''}`}
                onClick={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <h4 className="section-label">Category</h4>
            {uniqueCategories.map(cat => (
              <button 
                key={cat} 
                className={`filter-pill ${selectedCategories.includes(cat) ? 'active' : ''}`}
                onClick={() => toggleFilter(cat, selectedCategories, setSelectedCategories)}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="elite-grid">
          {filteredProducts.map(product => (
            <div className="elite-card" key={product._id}>
              <Link to={`/product/${product._id}`} className="elite-img-link">
                <img src={product.image.startsWith('/') ? `${import.meta.env.VITE_API_URL}${product.image}` : product.image} alt={product.name} />
                <div className="elite-overlay">
                  <span className="view-btn">Inspect</span>
                </div>
              </Link>
              <div className="elite-details">
                <span className="brand-tag">{product.brand}</span>
                <h3 className="item-name">{product.name}</h3>
                <div className="price-row">
                  <span className="item-price">Rs. {product.price.toLocaleString()}</span>
                  <button className="text-add-btn" onClick={() => addToCart(product, 1)}>+ Vault</button>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default CollectionPage;