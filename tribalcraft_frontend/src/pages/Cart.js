import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
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

  const removeFromCart = async (craftId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${craftId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Item removed from cart');
      fetchCart(); // Refresh cart
    } catch (error) {
      toast.error('Error removing item from cart');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCart({ items: [], totalAmount: 0 });
      toast.success('Cart cleared successfully');
    } catch (error) {
      toast.error('Error clearing cart');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  return (
    <div className="cart">
      <div className="cart-container">
        <h1>Your Cart</h1>
        
        {cart.items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/" className="continue-shopping">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map(item => (
                <div key={item.craftId} className="cart-item">
                  <img src={item.craftImage} alt={item.craftTitle} />
                  <div className="item-details">
                    <h3>{item.craftTitle}</h3>
                    <p className="item-price">{item.craftPrice}</p>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.craftId)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="total">
                <h3>Total: ${cart.totalAmount.toFixed(2)}</h3>
              </div>
              
              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <Link to="/checkout" className="checkout-btn">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;