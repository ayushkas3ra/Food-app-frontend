import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

function UserRegister() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userRegister = async (e) => {
        e.preventDefault();

        const fullName = e.target.fullName.value;
        const email = e.target.email.value;
        const contactNumber = e.target.phone.value;
        const password = e.target.password.value;

        try {
            setLoading(true);
            setError(null);

            const response = await api.post("/auth/user/register", {
                fullName,
                email,
                contactNumber,
                password
            });

            if (response.status === 201 || response.status === 200) {
                navigate("/user/login");
            }

        } catch (err) {

            console.error("Register error:", err);

            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
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
                        👤 User
                    </span>

                    <h1 className="auth-header__title">Create Account</h1>
                    <p className="auth-header__subtitle">
                        Join us to order your favorite food
                    </p>

                </div>

                <form className="auth-form" onSubmit={userRegister}>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Full Name</label>

                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter your full name"
                            name="fullName"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>

                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            name="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>

                        <input
                            type="tel"
                            className="form-input"
                            placeholder="Enter your phone number"
                            name="phone"
                            required
                        />
                    </div>

                    <div className="form-group">

                        <label className="form-label">Password</label>

                        <div className="password-wrapper">

                            <input
                                type="password"
                                className="form-input"
                                placeholder="Create a password"
                                name="password"
                                style={{ paddingRight: "2.5rem" }}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                            >
                                👁
                            </button>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/user/login" className="auth-footer__link">
                        Sign in
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
                    <span>Want to partner with us? </span>

                    <Link
                        to="/food-partner/register"
                        className="auth-footer__link"
                    >
                        Register as Food Partner
                    </Link>

                </div>

            </div>
        </div>
    );
}

export default UserRegister;