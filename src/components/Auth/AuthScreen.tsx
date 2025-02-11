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
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setMessage("");

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
        throw new Error(data.detail || "Something went wrong");
      }

      if (isSignUp) {
        setMessage("Registration successful! You can now log in.");
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
          <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
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
