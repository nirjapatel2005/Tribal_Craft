import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    shippingAddress: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      phone: ''
    },
    paymentMethod: 'cod',
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.totalAmount;
    const shippingCost = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const totalAmount = subtotal + shippingCost + tax;

    return { subtotal, shippingCost, tax, totalAmount };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const { shippingAddress } = formData;
    if (!shippingAddress.fullName || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.zipCode || !shippingAddress.phone) {
      toast.error('Please fill in all required shipping address fields');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post('/api/checkout/create-order', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success(`Order placed successfully! Order #${response.data.orderNumber}`);
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading checkout...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="checkout">
        <div className="checkout-container">
          <h1>Checkout</h1>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/buy-craft')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, shippingCost, tax, totalAmount } = calculateTotals();

  return (
    <div className="checkout">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Shipping Address</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="shippingAddress.fullName"
                      value={formData.shippingAddress.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="shippingAddress.phone"
                      value={formData.shippingAddress.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    name="shippingAddress.address"
                    value={formData.shippingAddress.address}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="shippingAddress.city"
                      value={formData.shippingAddress.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="shippingAddress.state"
                      value={formData.shippingAddress.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="shippingAddress.zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="shippingAddress.country"
                    value={formData.shippingAddress.country}
                    onChange={handleChange}
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                    />
                    <span>Credit Card</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleChange}
                    />
                    <span>UPI</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="net_banking"
                      checked={formData.paymentMethod === 'net_banking'}
                      onChange={handleChange}
                    />
                    <span>Net Banking</span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h2>Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special instructions for your order..."
                />
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={submitting}
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.craftImage} alt={item.craftTitle} />
                  <div className="item-details">
                    <h4>{item.craftTitle}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p className="price">{item.craftPrice}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

