import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact">
      <div className="page-container">
        <h1>Contact Us</h1>
        <p>Get in touch with the TribalCraft team</p>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3>Reach Out</h3>
            <div className="contact-item">
              <strong>Email:</strong> info@tribalcraft.com
            </div>
            <div className="contact-item">
              <strong>Phone:</strong> +1 (555) 123-4567
            </div>
            <div className="contact-item">
              <strong>Address:</strong> 123 Craft Street, Art District, City 12345
            </div>
          </div>
          
          <div className="contact-form-section">
            <h3>Send us a Message</h3>
            <form className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" rows="5" required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;