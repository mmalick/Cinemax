import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Logo from './Logo';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Logo />
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/films">Films</Link></li>
          <li><Link to="/lists">Lists</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <Link to="/login">
          <button className="login-btn">Log in</button>
        </Link>
        <Link to="/signup">
          <button className="signup-btn">Sign up</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
