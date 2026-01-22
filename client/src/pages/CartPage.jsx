import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { toast } from 'react-toastify';
import { FaTrashAlt, FaLock, FaArrowLeft, FaBoxOpen } from 'react-icons/fa';
import '../css/CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart();
  const navigate = useNavigate();

  const itemsSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingCost = itemsSubtotal > 0 ? 0 : 0; // Set to 0 for "Complimentary"
  const totalAmount = itemsSubtotal + shippingCost;

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    toast.info('Selection removed from vault.');
  };

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) {
      handleRemoveFromCart(productId);
    } else {
      updateCartQuantity(productId, newQty);
    }
  };

  return (
    <div className="vault-root">
      {/* 1. Header Section */}
      <header className="vault-header">
        <button onClick={() => navigate('/collection')} className="btn-return">
          <FaArrowLeft /> Keep Exploring
        </button>
        <div className="vault-badge">Collection 2024 / Secure Vault</div>
      </header>

      <div className="vault-title-section">
        <h1 className="editorial-title">Your Private Vault</h1>
        <p className="vault-subtitle">{cartItems.length} items currently secured.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-vault-state">
          <FaBoxOpen className="empty-icon" />
          <h2>Your Vault is Empty</h2>
          <p>Your curated selection will appear here once secured.</p>
          <Link to="/collection" className="btn-vault-action secondary">Return to Archive</Link>
        </div>
      ) : (
        <div className="vault-grid">
          {/* 2. Items List */}
          <div className="vault-items-list">
            {cartItems.map((item) => (
              <div key={item.product} className="vault-item-card">
                <div className="vault-item-image">
                  <Link to={`/product/${item.product}`}>
                    <img 
                      src={item.image?.startsWith('/') ? `${import.meta.env.VITE_API_URL}${item.image}` : item.image}
                      alt={item.name}
                    />
                  </Link>
                </div>

                <div className="vault-item-info">
                  <div className="info-top">
                    <span className="item-brand">Master Batch 1:1</span>
                    <Link to={`/product/${item.product}`} className="item-name">{item.name}</Link>
                    <span className="item-meta">Size: {item.selectedSize || 'Standard'}</span>
                  </div>
                  
                  <div className="info-bottom">
                    <div className="qty-selector">
                      <button onClick={() => handleQuantityChange(item.product, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => handleQuantityChange(item.product, item.qty + 1)}>+</button>
                    </div>
                  </div>
                </div>

                <div className="vault-item-pricing">
                  <p className="item-total-price">Rs. {(item.price * item.qty).toLocaleString()}</p>
                  <button onClick={() => handleRemoveFromCart(item.product)} className="btn-remove">
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Summary Sidebar */}
          <aside className="vault-summary">
            <div className="summary-card">
              <h3>Selection Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {itemsSubtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="gold-text">Complimentary</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
              
              <button className="btn-vault-action primary" onClick={() => navigate('/checkout')}>
                Proceed to Checkout <FaLock className="lock-icon" />
              </button>

              <div className="vault-trust-footer">
                <p>Inspected & Authenticated</p>
                <p>Encrypted Global Payment</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;