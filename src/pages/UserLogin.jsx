import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

function UserLogin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/auth/user/login", {
        email,
        password
      });

      if (response.status === 200) {
        navigate("/feed");
      }

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <span className="user-type-badge user-type-badge--user">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            User
          </span>

          <h1 className="auth-header__title">Welcome Back</h1>
          <p className="auth-header__subtitle">
            Sign in to continue to your account
          </p>
        </div>

        <form className="auth-form" onSubmit={userLogin}>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              name="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">

              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter your password"
                name="password"
                style={{ paddingRight: "2.5rem" }}
                required
              />

              <button
                type="button"
                className="password-toggle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-0.5rem" }}>
            <Link
              to="/user/forgot-password"
              className="auth-footer__link"
              style={{ fontSize: "0.8125rem" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/user/register" className="auth-footer__link">
            Sign up
          </Link>
        </div>

        <div
          className="auth-footer"
          style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid #eee"
          }}
        >
          <span>Are you a restaurant owner? </span>

          <Link
            to="/food-partner/login"
            className="auth-footer__link"
          >
            Login as Food Partner
          </Link>

        </div>

      </div>
    </div>
  );
}

export default UserLogin;