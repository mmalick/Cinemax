//import React from 'react';
import './Navbar.css';
import Logo from './Logo';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Logo />
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="/films">Films</a></li>
          <li><a href="/lists">Lists</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </div>
      <div className="navbar-right">
        <button className="login-btn">Log in</button>
        <button className="signup-btn">Sign up</button>
      </div>
    </nav>
  );
};

export default Navbar;
