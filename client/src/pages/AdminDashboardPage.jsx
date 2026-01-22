// client/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  FiBox, 
  FiShoppingBag, 
  FiUsers, 
  FiLogOut, 
  FiShield, 
  FiTrendingUp, 
  FiActivity, 
  FiPieChart,
  FiExternalLink,
  FiRefreshCcw // Icon for Returns
} from 'react-icons/fi';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
// Assuming you will create this component next:
// import ReturnManagement from '../components/admin/ReturnManagement'; 

import '../css/AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const { user, loading, authAxios, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      toast.error('Access Restricted. High-Level Clearance Required.');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="vault-loader">Decrypting Administrative Access...</div>;

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <FiShield className="denied-icon" />
        <h2>Clearance Denied</h2>
        <p>Your profile does not hold the administrative credentials required for this sector.</p>
      </div>
    );
  }

  const adminProps = { user, authAxios, token };

  return (
    <div className="atelier-root">
      <aside className="atelier-sidebar">
        <div className="atelier-brand">
          <span className="gold-label">Master-Grade Elite</span>
          <h1>Command <br/>Atelier</h1>
        </div>
        
        <div className="admin-profile-card">
          <div className="admin-avatar">{user.name.charAt(0)}</div>
          <div className="admin-info">
            <span className="admin-name">{user.name}</span>
            <span className="admin-role">Lead Curator</span>
          </div>
        </div>

        <nav className="atelier-nav">
          <ul>
            <li className="boutique-link" onClick={() => navigate('/home')}>
              <FiExternalLink /> <span className="gold-text">View Boutique</span>
            </li>

            <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
              <FiPieChart /> <span>Executive Summary</span>
            </li>
            <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
              <FiBox /> <span>Inventory Registry</span>
            </li>
            <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
              <FiShoppingBag /> <span>Acquisition Logs</span>
            </li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
              <FiUsers /> <span>Client Directory</span>
            </li>
            {/* 👉 NEW: RETURNED ITEMS TAB */}
            <li className={activeTab === 'returns' ? 'active' : ''} onClick={() => setActiveTab('returns')}>
              <FiRefreshCcw /> <span>Returned Items</span>
            </li>
          </ul>
        </nav>

        <button className="atelier-logout-btn" onClick={handleLogout}>
          <FiLogOut /> <span>Exit Headquarters</span>
        </button>
      </aside>

      <main className="atelier-content">
        <header className="atelier-top-bar">
          <div className="top-bar-left">
            <span className="breadcrumb">HQ / {activeTab.toUpperCase()}</span>
            <h2 className="serif-heading">
              {activeTab === 'overview' && "Business Intelligence Overview"}
              {activeTab === 'products' && "Curated Inventory Management"}
              {activeTab === 'orders' && "Order Fulfillment & Logistics"}
              {activeTab === 'users' && "Global Client Management"}
              {activeTab === 'returns' && "Reverse Logistics & Returns"}
            </h2>
          </div>
          <div className="status-indicator">
            <span className="pulse-dot"></span> System Live
          </div>
        </header>

        <section className="atelier-view-area">
          {activeTab === 'overview' && (
            <div className="stats-grid">
              <div className="stat-card gold-border">
                <FiTrendingUp className="stat-icon" />
                <div className="stat-info">
                  <p>Total Revenue</p>
                  <h3>Rs. 1,240,500</h3>
                  <span className="trend positive">+12.5% this month</span>
                </div>
              </div>
              <div className="stat-card">
                <FiActivity className="stat-icon" />
                <div className="stat-info">
                  <p>Active Orders</p>
                  <h3>24 Pending</h3>
                  <span className="trend">8 awaiting shipping</span>
                </div>
              </div>
              <div className="stat-card">
                <FiRefreshCcw className="stat-icon" />
                <div className="stat-info">
                  <p>Open Returns</p>
                  <h3>3 Requests</h3>
                  <span className="trend negative">Awaiting inspection</span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'products' && <ProductManagement adminUser={adminProps} />}
          {activeTab === 'orders' && <OrderManagement adminUser={adminProps} />}
          {activeTab === 'users' && <UserManagement adminUser={adminProps} />}
          {activeTab === 'returns' && (
            <div className="placeholder-view">
              <h3>Reverse Logistics Portal</h3>
              <p>Items awaiting authentication before restocking.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboardPage;