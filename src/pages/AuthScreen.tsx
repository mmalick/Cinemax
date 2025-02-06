import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import './AuthScreen.css'; // Importowanie pliku CSS

interface AuthProps {
  isSignUp?: boolean;
}

const AuthScreen: React.FC<AuthProps> = ({ isSignUp = false }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    console.log(isSignUp ? "Signing up..." : "Logging in...");
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-box">
          <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
          <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-box"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-box"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-box"
              required
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-box"
                required
              />
            )}
            <button type="submit" className="submit-button">
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>
          <p className="footer-text">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link to={isSignUp ? "/login" : "/signup"} className="link-text">
              {isSignUp ? "Login" : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthScreen;
