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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/checkout/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
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

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders">
      <div className="orders-container">
        <h1>My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/buy-craft')} className="shop-now-btn">
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
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      View Details
                    </button>
                    {order.orderStatus === 'pending' && (
                      <button 
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(order._id)}
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
    </div>
  );

  async function handleCancelOrder(orderId) {
    try {
      await axios.put(`http://localhost:5000/api/checkout/orders/${orderId}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Order cancelled successfully');
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  }
};

export default Orders;

