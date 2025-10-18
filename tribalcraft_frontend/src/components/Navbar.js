import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          TribalCraft
        </Link>
        <ul className="navbar-menu">
          {location.pathname !== '/' && (
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Home</Link>
            </li>
          )}
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link">Contact Us</Link>
          </li>
          {isAuthenticated && user?.role === 'admin' && (
            <li className="navbar-item">
              <Link to="/admin" className="navbar-link">Admin</Link>
            </li>
          )}
          {isAuthenticated ? (
            <>
              <li className="navbar-item">
                <span className="navbar-link">Welcome, {user?.username}</span>
              </li>
              <li className="navbar-item">
                <button onClick={logout} className="navbar-link logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/signup" className="navbar-link">Sign Up</Link>
              </li>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;