import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/checkout/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(response.data);
      setLoading(false);
      
      // Show success toast if orders are loaded successfully
      if (response.data.length > 0) {
        toast.success(`Loaded ${response.data.length} order${response.data.length > 1 ? 's' : ''} successfully`);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders. Please try again.');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      case 'refunded': return '#6c757d';
      default: return '#6c757d';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;

    setShowCancelModal(false);
    
    // Show loading toast
    const loadingToast = toast.loading('Cancelling order...');

    try {
      await axios.put(`/api/checkout/orders/${orderToCancel}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Order cancelled successfully!');
      
      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error('Failed to cancel order. Please try again.');
    } finally {
      setOrderToCancel(null);
    }
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
    toast('Order cancellation cancelled');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="orders-container">
        <h1>My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <button 
              onClick={() => {
                toast('Redirecting to shop...', {
                  duration: 2000,
                });
                navigate('/buy-craft');
              }} 
              className="shop-now-btn"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                    >
                      {order.orderStatus.toUpperCase()}
                    </span>
                    <span 
                      className="payment-status"
                      style={{ color: getPaymentStatusColor(order.paymentStatus) }}
                    >
                      Payment: {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.craftImage} alt={item.craftTitle} />
                      <div className="item-details">
                        <h4>{item.craftTitle}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p className="price">{item.craftPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                  </div>
                  <div className="order-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => {
                        toast('Opening order details...', {
                          duration: 2000,
                        });
                        navigate(`/orders/${order._id}`);
                      }}
                    >
                      View Details
                    </button>
                    {order.orderStatus === 'pending' && (
                      <button 
                        className="cancel-order-btn"
                        onClick={() => handleCancelClick(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cancel Order</h3>
            <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={handleCancelCancel}
              >
                Keep Order
              </button>
              <button 
                className="confirm-btn"
                onClick={handleCancelConfirm}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

