import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

function FoodPartnerRegister() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        ownerName: "",
        email: "",
        contactNumber: "",
        address: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const foodPartnerRegister = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const response = await api.post("/auth/food-partner/register", form);

            if (response.status === 201 || response.status === 200) {
                navigate("/food-partner/login");
            }

        } catch (err) {
            console.error("Register error:", err);

            setError(
                err.response?.data?.message || "Registration failed. Please try again."
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

                    <h1 className="auth-header__title">Partner Registration</h1>
                    <p className="auth-header__subtitle">
                        Join us to grow your food business
                    </p>
                </div>

                <form className="auth-form" onSubmit={foodPartnerRegister}>

                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Restaurant Name</label>

                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter restaurant name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Owner Name</label>

                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter owner name"
                            name="ownerName"
                            value={form.ownerName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>

                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter business email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>

                        <input
                            type="tel"
                            className="form-input"
                            placeholder="Enter phone number"
                            name="contactNumber"
                            value={form.contactNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Restaurant Address</label>

                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter restaurant address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>

                        <div className="password-wrapper">

                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                placeholder="Create a password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                style={{ paddingRight: "2.5rem" }}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(prev => !prev)}
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
                        {loading ? "Registering..." : "Register as Partner"}
                    </button>

                </form>

                <div className="auth-footer">
                    Already a partner?{" "}
                    <Link to="/food-partner/login" className="auth-footer__link">
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
                    <span>Want to order food? </span>

                    <Link to="/user/register" className="auth-footer__link">
                        Register as User
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default FoodPartnerRegister;