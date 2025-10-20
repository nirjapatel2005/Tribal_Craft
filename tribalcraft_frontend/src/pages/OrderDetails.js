import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Orders.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    fetchOrder();
  }, [isAuthenticated, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/checkout/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch order details');
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading order...</div>;
  }

  if (!order) {
    return <div className="loading">Order not found</div>;
  }

  return (
    <div className="orders">
      <div className="orders-container">
        <h1>Order #{order.orderNumber}</h1>

        <div className="orders-list">
          <div className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Status: {order.orderStatus.toUpperCase()}</h3>
                <p className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-status">
                <span className="payment-status">Payment: {order.paymentStatus.toUpperCase()}</span>
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
                <button className="view-details-btn" onClick={() => navigate('/orders')}>Back to Orders</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

