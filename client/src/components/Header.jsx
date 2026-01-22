// client/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../css/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="main-header luxury-header-ui">
      <div className="header-container">
        {/* Logo - Elegant Serif */}
        <Link to={user ? "/home" : "/"} className="logo-luxury">
          THE DUNK <span className="logo-sub">STORE</span>
        </Link>

        <nav className="main-nav-luxury">
          <ul className="nav-list">
            {/* Primary Navigation */}
            <div className="nav-group-left">
              <li><Link to="/home" className="nav-link">Home</Link></li>
              <li><Link to="/collection" className="nav-link">Collection</Link></li>
              <li><Link to="/about" className="nav-link">Heritage</Link></li>
            </div>

            {/* Utility Navigation */}
            <div className="nav-group-right">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <li><Link to="/admin/dashboard" className="admin-tag">Admin</Link></li>
                  )}
                  
                  <li>
                    <Link to="/orders" className="icon-link-luxury" title="My Orders">
                      <i className="fa-solid fa-clipboard-list"></i>
                    </Link>
                  </li>
                  
                  <li>
                    <Link to="/cart" className="icon-link-luxury" title="Cart">
                      <i className="fa-solid fa-cart-shopping"></i>
                      {cartItemCount > 0 && (
                        <span className="luxury-badge">{cartItemCount}</span>
                      )}
                    </Link>
                  </li>
                  
                  <li>
                    <button onClick={handleLogout} className="logout-btn-luxury">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="nav-link">Login</Link></li>
                  <li><Link to="/register" className="nav-link-cta">Join</Link></li>
                </>
              )}
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;