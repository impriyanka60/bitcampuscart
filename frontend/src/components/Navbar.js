import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo"> 🛍️ BIT Camp-Cart</div>
        <div className={`nav-links ${isMobileMenuOpen ? 'nav-links-mobile' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
          {isLoggedIn && <Link to="/post" className="nav-link" onClick={closeMobileMenu}>Sell Item</Link>}
          {isLoggedIn && <Link to="/my-listings" className="nav-link" onClick={closeMobileMenu}>My Listings</Link>}
          {isLoggedIn && <Link to="/mess" className="nav-link" onClick={closeMobileMenu}>Mess Menu</Link>}
          {isLoggedIn && <Link to="/bus" className="nav-link" onClick={closeMobileMenu}>Bus Schedule</Link>}
          {isLoggedIn && <Link to="/network" className="nav-link" onClick={closeMobileMenu}>Network Setup</Link>}
          {isLoggedIn && <Link to="/complaints" className="nav-link" onClick={closeMobileMenu}>Complaints</Link>}
        </div>
      </div>
      <div className="navbar-right">
        <div className={`nav-auth ${isMobileMenuOpen ? 'nav-auth-mobile' : ''}`}>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" className="nav-link" onClick={closeMobileMenu}>Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="logout-button">Logout</button>
          )}
        </div>
        <div className="hamburger" onClick={toggleMobileMenu}>
          <span className={isMobileMenuOpen ? 'line active' : 'line'}></span>
          <span className={isMobileMenuOpen ? 'line active' : 'line'}></span>
          <span className={isMobileMenuOpen ? 'line active' : 'line'}></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
