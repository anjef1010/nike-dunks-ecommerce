import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiDownload, FiPackage, FiChevronDown, FiChevronUp, FiAward } from 'react-icons/fi';
import '../css/OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const { user, authAxios } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // This must match your backend route exactly
        const { data } = await authAxios.get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error("Archive Fetch Error:", err);
        toast.error('Unable to access the private archive.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user, authAxios]);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) return <div className="vault-loader">Authenticating Archive Access...</div>;

  return (
    <div className="archive-root">
      <header className="archive-header">
        <div className="header-left">
          <span className="gold-label">Member Since {new Date(user?.createdAt).getFullYear() || '2024'}</span>
          <h1 className="editorial-title">Acquisition Archive</h1>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="empty-archive">
          <FiPackage className="empty-icon" />
          <h2>Archive Empty</h2>
          <p>No master-grade selections have been secured under this profile.</p>
          <Link to="/collection" className="btn-vault-action-outline">Explore Collection</Link>
        </div>
      ) : (
        <div className="archive-timeline">
          {orders.map((order) => (
            <div key={order._id} className={`archive-entry ${expandedOrderId === order._id ? 'active' : ''}`}>
              <div className="entry-summary" onClick={() => toggleExpand(order._id)}>
                <div className="summary-col">
                  <span className="col-label">Date Secured</span>
                  <span className="col-value">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="summary-col">
                  <span className="col-label">Reference</span>
                  <span className="col-value">#{order._id.substring(18).toUpperCase()}</span>
                </div>
                <div className="summary-col">
                  <span className="col-label">Status</span>
                  <span className={`status-badge ${order.isDelivered ? 'delivered' : 'transit'}`}>
                    {order.isDelivered ? 'Secured in Vault' : 'In Transit'}
                  </span>
                </div>
                <div className="summary-col">
                  <span className="col-label">Investment</span>
                  <span className="col-value">Rs. {order.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="summary-toggle">
                  {expandedOrderId === order._id ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>

              {expandedOrderId === order._id && (
                <div className="entry-details">
                  <div className="details-grid">
                    <div className="items-list">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="detail-item">
                          <img 
                            src={item.image?.startsWith('/') ? `${import.meta.env.VITE_API_URL}${item.image}` : item.image} 
                            alt={item.name} 
                          />
                          <div className="item-info">
                            <h4>{item.name}</h4>
                            <p>Master Batch 1:1 — Qty: {item.qty}</p>
                          </div>
                          <span className="item-price">Rs. {item.price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="shipping-info-card">
                      <div className="info-block">
                        <FiAward className="gold-icon" />
                        <h5>Authentication Certified</h5>
                        <p>This acquisition has passed our workshop inspection and quality control.</p>
                      </div>
                      <div className="info-block">
                        <h5>Shipping Destination</h5>
                        <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                      </div>
                      <button className="btn-invoice">
                        <FiDownload /> Export Documentation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;