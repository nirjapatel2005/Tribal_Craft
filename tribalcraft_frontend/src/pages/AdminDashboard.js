import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [pendingCrafts, setPendingCrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCrafts();
  }, []);

  const fetchPendingCrafts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crafts/pending');
      setPendingCrafts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending crafts:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (craftId) => {
    try {
      await axios.put(`http://localhost:5000/api/crafts/approve/${craftId}`);
      alert('Craft approved successfully!');
      fetchPendingCrafts(); // Refresh list
    } catch (error) {
      alert('Error approving craft');
    }
  };

  const handleReject = async (craftId) => {
    try {
      await axios.put(`http://localhost:5000/api/crafts/reject/${craftId}`);
      alert('Craft rejected');
      fetchPendingCrafts(); // Refresh list
    } catch (error) {
      alert('Error rejecting craft');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
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
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprove(craft._id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleReject(craft._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;