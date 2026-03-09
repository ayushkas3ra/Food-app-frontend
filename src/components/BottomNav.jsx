import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./BottomNav.css";

function BottomNav({ currentFoodId, isSaved }) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(isSaved);
    const navigate = useNavigate();

    useEffect(() => {
        setSaved(isSaved);
    }, [isSaved]);

    const handleHome = () => {
        navigate("/feed");
    };

    const handleProfile = () => {
        navigate("/user/profile");
    };

    const handleSave = async () => {
        if (!currentFoodId || saving) return;

        try {
            setSaving(true);

            await api.post("/food/save", {
                foodId: currentFoodId,
            });

            setSaved((prev) => !prev);
        } catch (error) {
            console.error("Error saving food:", error);

            if (error.response?.status === 401) {
                navigate("/user/login");
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bottom-nav">
            <button className="bottom-nav-btn home-btn" onClick={handleHome}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Home</span>
            </button>

            <button
                className={`bottom-nav-btn save-btn ${saved ? "saved" : ""}`}
                onClick={handleSave}
                disabled={saving}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={saved ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>{saving ? "Saving..." : saved ? "Saved" : "Save"}</span>
            </button>

            <button className="bottom-nav-btn profile-btn" onClick={handleProfile}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Profile</span>
            </button>
        </div>
    );
}

export default BottomNav;