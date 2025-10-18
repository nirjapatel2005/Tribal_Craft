import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [pendingCrafts, setPendingCrafts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('crafts'); // 'crafts' | 'orders'

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setLoading(false);
      return;
    }
    fetchPendingCrafts();
    fetchOrders();
  }, [isAuthenticated, user]);

  const fetchPendingCrafts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crafts/pending', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPendingCrafts(response.data);
    } catch (error) {
      console.error('Error fetching pending crafts:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/checkout/admin/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (craftId) => {
    try {
      await axios.put(`http://localhost:5000/api/crafts/approve/${craftId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Craft approved successfully!');
      fetchPendingCrafts(); // Refresh list
    } catch (error) {
      toast.error('Error approving craft');
    }
  };

  const handleReject = async (craftId) => {
    try {
      await axios.put(`http://localhost:5000/api/crafts/reject/${craftId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Craft rejected');
      fetchPendingCrafts(); // Refresh list
    } catch (error) {
      toast.error('Error rejecting craft');
    }
  };

  const updateOrderStatus = async (orderId, updates) => {
    try {
      await axios.put(`http://localhost:5000/api/checkout/orders/${orderId}/status`, updates, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Order updated');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="loading">Access denied. Admins only.</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'crafts' ? 'active' : ''}`}
            onClick={() => setActiveTab('crafts')}
          >
            Crafts ({pendingCrafts.length} pending)
          </button>
          <button 
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'crafts' && (
          <>
            <h2>Pending Craft Submissions ({pendingCrafts.length})</h2>
            {pendingCrafts.length === 0 ? (
              <p>No pending submissions</p>
            ) : (
              <div className="crafts-grid">
                {pendingCrafts.map(craft => (
                  <div key={craft._id} className="craft-card">
                    <img 
                      src={`http://localhost:5000${craft.imageUrl}`} 
                      alt={craft.itemName}
                      className="craft-image"
                    />
                    <div className="craft-details">
                      <h3>{craft.itemName}</h3>
                      <p><strong>Price:</strong> {craft.price}</p>
                      <p><strong>Region:</strong> {craft.region}</p>
                      <p><strong>Artist:</strong> {craft.artistName}</p>
                      <p><strong>Seller:</strong> {craft.sellerFullName}</p>
                      <p><strong>Email:</strong> {craft.sellerEmail}</p>
                      <p><strong>Phone:</strong> {craft.sellerPhone}</p>
                      <p><strong>Description:</strong> {craft.description}</p>
                      <div className="admin-actions">
                        <button className="approve-btn" onClick={() => handleApprove(craft._id)}>Approve</button>
                        <button className="reject-btn" onClick={() => handleReject(craft._id)}>Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <h2>Orders</h2>
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>User</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td>{o.orderNumber}</td>
                        <td>{o.userId?.username || o.userId?.email || 'N/A'}</td>
                        <td>${o.totalAmount.toFixed(2)}</td>
                        <td>
                          <select
                            value={o.paymentStatus}
                            onChange={(e) => updateOrderStatus(o._id, { paymentStatus: e.target.value })}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={o.orderStatus}
                            onChange={(e) => updateOrderStatus(o._id, { orderStatus: e.target.value })}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button className="approve-btn" onClick={() => updateOrderStatus(o._id, { orderStatus: 'confirmed' })}>Confirm</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;