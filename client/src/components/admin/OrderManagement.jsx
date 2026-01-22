// client/src/components/admin/OrderManagement.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../../css/OrderManagement.css'; 

const OrderManagement = ({ adminUser }) => {
  const { authAxios, token } = adminUser || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        if (authAxios && token) {
          const { data } = await authAxios.get('/api/orders');
          
          // FIX: Your API returns the array directly, not inside { orders: [] }
          if (Array.isArray(data)) {
            setOrders(data);
          } else if (data && Array.isArray(data.orders)) {
            setOrders(data.orders);
          } else {
            setError('Invalid orders data format received from API.');
            setOrders([]); 
          }
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        toast.error(`Failed to load orders: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    if (authAxios && token) {
      fetchOrders();
    }
  }, [authAxios, token]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const statusToUpdate = newStatus === 'delivered' ? 'delivered' : 'pending';
      
      const { data } = await authAxios.put(
        `/api/orders/${orderId}/delivery-status`, 
        { status: statusToUpdate }
      );
      
      // Update local state based on return object or manual map
      if (data && data.order) {
        setOrders(orders.map(order => 
          order._id === orderId ? data.order : order
        ));
      } else {
        setOrders(orders.map(order => 
          order._id === orderId ? { 
            ...order, 
            isDelivered: statusToUpdate === 'delivered',
            isPaid: statusToUpdate === 'delivered' ? true : order.isPaid,
          } : order
        ));
      }
      
      toast.success(`Order marked as ${statusToUpdate}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update order status';
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="admin-loading">Loading orders...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;

  return (
    <div className="admin-section">
      <h2>Order Management</h2>
      <div className="admin-list-container">
        {orders.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Total</th><th>Paid</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.substring(0, 8)}...</td>
                  <td>{order.user?.name || 'Guest'}</td>
                  <td>Rs. {order.totalPrice?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-indicator ${order.isPaid ? 'paid' : 'unpaid'}`}>
                      {order.isPaid ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-indicator ${order.isDelivered ? 'delivered' : 'pending'}`}>
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="admin-action-btn view" onClick={() => handleViewOrder(order)}>View</button>
                    <button
                      className="admin-action-btn update"
                      onClick={() => handleUpdateOrderStatus(order._id, order.isDelivered ? 'pending' : 'delivered')}
                    >
                      {order.isDelivered ? 'Mark Pending' : 'Mark Delivered'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>Order Details #{selectedOrder._id.substring(0, 8)}...</h3>
            
            <div className="order-info">
              <div className="info-row"><span className="info-label">Customer:</span><span>{selectedOrder.user?.name || 'N/A'}</span></div>
              <div className="info-row"><span className="info-label">Email:</span><span>{selectedOrder.user?.email || 'N/A'}</span></div>
              <div className="info-row"><span className="info-label">Total:</span><span>Rs. {selectedOrder.totalPrice?.toFixed(2)}</span></div>
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className={`status ${selectedOrder.isDelivered ? 'delivered' : 'pending'}`}>
                  {selectedOrder.isDelivered ? 'Delivered' : 'Pending'}
                </span>
              </div>
            </div>

            <h4>Order Items</h4>
            <div className="order-items">
              {selectedOrder.orderItems?.map((item) => (
                <div key={item.product || item._id} className="order-item">
                  <img 
                    src={item.image.startsWith('/') ? `${import.meta.env.VITE_API_URL}${item.image}` : item.image} 
                    alt={item.name} 
                    className="item-image"
                  />
                  <div className="item-details">
                    <h5>{item.name}</h5>
                    <p>Rs. {item.price.toFixed(2)} × {item.qty}</p>
                    <p>Subtotal: Rs. {(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="shipping-info">
              <h4>Shipping Address</h4>
              <p>{selectedOrder.shippingAddress?.address}</p>
              <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;