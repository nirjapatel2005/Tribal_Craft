import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post('/api/contact/submit', formData);
      
      toast.success(response.data.message);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <div className="page-container">
        <h1>Contact Us</h1>
        <p>Get in touch with the TribalCraft team</p>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3>Reach Out</h3>
            <div className="contact-item">
              <strong>Email:</strong> info@tribal-craft.onrender.com
            </div>
            <div className="contact-item">
              <strong>Phone:</strong> +91 xxxxxxxxxx
            </div>
            <div className="contact-item">
              <strong>Address:</strong> 123 Craft Street, Art District, City 12345
            </div>
          </div>
          
          <div className="contact-form-section">
            <h3>Send us a Message</h3>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Your Email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <textarea 
                name="message"
                placeholder="Your Message" 
                rows="5" 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;