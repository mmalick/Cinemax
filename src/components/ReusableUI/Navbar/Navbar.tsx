import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
import Logo from "./Logo";
import MovieSearch from "../../Movie/MovieSection/MovieSearch";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkAuth);
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
          <li><Link to="/films">Filmy</Link></li>
          <li><Link to="/lists">Listy</Link></li>
        </ul>
      </div>
      <div className="navbar-middle">
        <MovieSearch />
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
