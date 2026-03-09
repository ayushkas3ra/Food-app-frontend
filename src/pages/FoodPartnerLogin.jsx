import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

function FoodPartnerLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const foodPartnerLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const response = await api.post("/auth/food-partner/login", {
                email,
                password,
            });

            if (response.status === 200) {
                navigate("/food-partner/dashboard");
            }
        } catch (err) {
            console.error("Login error:", err);

            setError(
                err.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="user-type-badge user-type-badge--partner">
                        🍽 Food Partner
                    </span>

                    <h1 className="auth-header__title">Partner Login</h1>
                    <p className="auth-header__subtitle">
                        Sign in to manage your restaurant
                    </p>
                </div>

                <form className="auth-form" onSubmit={foodPartnerLogin}>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>

                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter business email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>

                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingRight: "2.5rem" }}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                👁
                            </button>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "-0.5rem",
                        }}
                    >
                        <Link
                            to="/food-partner/forgot-password"
                            className="auth-footer__link"
                            style={{ fontSize: "0.8125rem" }}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/food-partner/register" className="auth-footer__link">
                        Register
                    </Link>
                </div>

                <div
                    className="auth-footer"
                    style={{
                        marginTop: "1rem",
                        paddingTop: "1rem",
                        borderTop: "1px solid #eee",
                    }}
                >
                    <span>Want to order food? </span>

                    <Link to="/user/login" className="auth-footer__link">
                        Login as User
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FoodPartnerLogin;