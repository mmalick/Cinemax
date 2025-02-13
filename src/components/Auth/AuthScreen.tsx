import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../ReusableUI/Navbar/Navbar";
import "./AuthScreen.css";

interface AuthProps {
  isSignUp?: boolean;
}

const AuthScreen: React.FC<AuthProps> = ({ isSignUp = false }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && password !== confirmPassword) {
      setError("Hasła nie pasują do siebie.");
      return;
    }

    setError("");

    const userData = isSignUp
      ? { username, email, password } 
      : { username, password };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/${isSignUp ? "register" : "login"}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Coś poszło nie tak.");
      }

      if (isSignUp) {
        setShowNotification(true); 
        setTimeout(() => {
          setShowNotification(false);
          navigate("/login");
        }, 3000);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("loginTime", Date.now().toString());
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-box">
          <h2>{isSignUp ? "Rejestracja" : "Logowanie"}</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nazwa użytkownika"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-box"
              required
            />
            {isSignUp && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-box"
                required
              />
            )}
            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-box"
              required
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Powtórz hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-box"
                required
              />
            )}
            <button type="submit" className="submit-button">
              {isSignUp ? "Zarejestruj się" : "Zaloguj się"}
            </button>
          </form>
          <p className="footer-text">
            {isSignUp ? "Posiadasz konto?" : "Nie posiadasz konta?"}{" "}
            <Link to={isSignUp ? "/login" : "/signup"} className="link-text">
              {isSignUp ? "Zaloguj się" : "Zarejestruj się"}
            </Link>
          </p>
        </div>
      </div>

      {showNotification && (
        <div className="notification success-notification">
          Konto utworzone! Teraz możesz się zalogować.
        </div>
      )}
    </>
  );
};

export default AuthScreen;
