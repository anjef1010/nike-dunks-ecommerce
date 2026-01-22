import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaLock, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import '../css/CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user, authAxios } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'Nepal',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const itemsSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingCost = 0; // Complimentary in Master-Grade
  const totalAmount = itemsSubtotal + shippingCost;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/collection');
    }
  }, [cartItems, navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const orderData = {
    orderItems: cartItems.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      qty: item.qty,
      // If your model requires size, add it here:
      size: item.selectedSize 
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice: itemsSubtotal,
    shippingPrice: shippingCost, // This is 0 for "Complimentary"
    taxPrice: 0,
    totalPrice: totalAmount,
  };

  try {
    await authAxios.post('/api/orders', orderData);
    toast.success("Purchase Successful. Your selection is being prepared.");
    clearCart();
    navigate('/orders'); 
  } catch (err) {
    toast.error(err.response?.data?.message || "Checkout failed.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="checkout-master-root">
      <header className="checkout-minimal-nav">
        <button onClick={() => navigate('/cart')} className="btn-back-vault">
          <FaArrowLeft /> Return to Vault
        </button>
        <div className="secure-badge">
          <FaLock /> Secure Encrypted Checkout
        </div>
      </header>

      <div className="checkout-editorial-grid">
        {/* Left: Shipping & Method */}
        <div className="checkout-form-section">
          <div className="section-header">
            <span className="step-count">01</span>
            <h2 className="serif-heading">Shipping Details</h2>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="luxury-form">
            <div className="form-row">
              <div className="form-group">
                <label>Shipping Address</label>
                <input 
                  type="text" 
                  placeholder="Street address or P.O. Box"
                  required 
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row split">
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  required 
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input 
                  type="text" 
                  required 
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                />
              </div>
            </div>

            <div className="section-header spacing-top">
              <span className="step-count">02</span>
              <h2 className="serif-heading">Payment Method</h2>
            </div>

            <div className="payment-selection">
              <label className={`payment-node ${paymentMethod === 'COD' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={() => setPaymentMethod('COD')}
                />
                <div className="node-content">
                  <span className="node-title">Cash on Delivery</span>
                  <span className="node-desc">Pay securely upon arrival.</span>
                </div>
              </label>

              <label className={`payment-node ${paymentMethod === 'Card' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="Card" 
                  checked={paymentMethod === 'Card'} 
                  onChange={() => setPaymentMethod('Card')}
                />
                <div className="node-content">
                  <span className="node-title">Digital Payment</span>
                  <span className="node-desc">Visa, MasterCard, or eSewa.</span>
                </div>
              </label>
            </div>
          </form>
        </div>

        {/* Right: Order Review */}
        <aside className="checkout-summary-sidebar">
          <div className="summary-sticky-card">
            <h3 className="summary-title">Order Review</h3>
            
            <div className="summary-items-scroll">
              {cartItems.map((item) => (
                <div key={item.product} className="summary-item">
                  <div className="item-visual">
                    <img src={item.image.startsWith('/') ? `${import.meta.env.VITE_API_URL}${item.image}` : item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-meta">Qty: {item.qty} — Size: {item.selectedSize}</span>
                    <span className="item-price">Rs. {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-calculations">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>Rs. {itemsSubtotal.toLocaleString()}</span>
              </div>
              <div className="calc-row">
                <span>Shipping</span>
                <span className="gold-text">Complimentary</span>
              </div>
              <div className="calc-total">
                <span>Total Amount</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form" 
              className="btn-place-order"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>

            <div className="security-guarantee">
              <FaShieldAlt /> 
              <span>Authenticity & Secure Delivery Guaranteed</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;