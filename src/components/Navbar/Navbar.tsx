import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
import Logo from "./Logo";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));

    window.addEventListener("storage", checkAuth); // Nasłuchiwanie zmian w localStorage
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("loginTime");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Logo />
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/films">Filmy</Link></li>
          <li><Link to="/lists">Listy</Link></li>
          <li><Link to="/profile">Profil</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-btn">Wyloguj</button>
        ) : (
          <>
            <Link to="/login">
              <button className="login-btn">Zaloguj</button>
            </Link>
            <Link to="/signup">
              <button className="signup-btn">Zarejestruj się</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
