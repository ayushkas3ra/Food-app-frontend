import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./foodPartnerProfile.css";

function FoodPartnerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [foodPartner, setFoodPartner] = useState(null);
    const [foods, setFoods] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeTab, setActiveTab] = useState("videos");
    const [playingVideoId, setPlayingVideoId] = useState(null);

    const videoRefs = useRef({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [partnerRes, foodsRes] = await Promise.all([
                    api.get(`/auth/food-partner/${id}`),
                    api.get(`/food/partner/${id}`)
                ]);

                setFoodPartner(partnerRes.data.foodPartner);
                setFoods(foodsRes.data.foodItems || []);

            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            Object.values(videoRefs.current).forEach(v => v?.pause());
        };

    }, [id]);

    const handleVideoClick = (foodId) => {
        const video = videoRefs.current[foodId];

        if (!video) return;

        if (playingVideoId === foodId) {
            video.pause();
            setPlayingVideoId(null);
        } else {
            Object.values(videoRefs.current).forEach(v => v?.pause());

            video.play().catch(() => { });
            setPlayingVideoId(foodId);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const formatNumber = (num) => {
        if (!num) return "0";
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };

    const getInitials = (name) => {
        if (!name) return "?";

        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-loading">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-container">
                <div className="profile-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">

                <button className="profile-back" onClick={handleBack}>
                    ←
                </button>

                <div className="profile-pic-container">
                    {foodPartner?.profilePic ? (
                        <img
                            src={foodPartner.profilePic}
                            alt={foodPartner.name}
                            className="profile-pic"
                        />
                    ) : (
                        <div className="profile-pic-placeholder">
                            {getInitials(foodPartner?.name)}
                        </div>
                    )}
                </div>

                <h1 className="profile-name">
                    {foodPartner?.name || "Unknown"}
                </h1>

                <p className="profile-owner">
                    @{foodPartner?.ownerName || "Owner"}
                </p>

                <div className="profile-stats">

                    <div className="stat-item">
                        <span className="stat-value">
                            {formatNumber(foodPartner?.totalMeals)}
                        </span>
                        <span className="stat-label">Meals</span>
                    </div>

                    <div className="stat-item">
                        <span className="stat-value">
                            {formatNumber(foodPartner?.totalCustomersServed)}
                        </span>
                        <span className="stat-label">Customers</span>
                    </div>

                    <div className="stat-item">
                        <span className="stat-value">{foods.length}</span>
                        <span className="stat-label">Videos</span>
                    </div>

                </div>
            </div>

            <div className="profile-tabs">

                <button
                    className={`profile-tab ${activeTab === "videos" ? "active" : ""}`}
                    onClick={() => setActiveTab("videos")}
                >
                    🎬 Videos
                </button>

                <button
                    className={`profile-tab ${activeTab === "info" ? "active" : ""}`}
                    onClick={() => setActiveTab("info")}
                >
                    ℹ️ Info
                </button>

            </div>

            {activeTab === "videos" && (
                <div className="profile-videos">

                    {foods.length === 0 ? (

                        <div className="profile-empty">
                            <div className="profile-empty-icon">🎥</div>
                            <p className="profile-empty-text">No videos yet</p>
                        </div>

                    ) : (

                        <div className="videos-grid">

                            {foods.map((food) => (
                                <div key={food._id} className="video-item">

                                    <div
                                        className="video-wrapper"
                                        onClick={() => handleVideoClick(food._id)}
                                    >

                                        <video
                                            ref={(el) => (videoRefs.current[food._id] = el)}
                                            src={food.video}
                                            loop
                                            muted
                                            playsInline
                                            preload="metadata"
                                        />

                                        {playingVideoId !== food._id && (
                                            <div className="video-play-icon">▶</div>
                                        )}

                                        <div className="video-overlay">
                                            <p className="video-title">{food.name}</p>
                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>

                    )}

                </div>
            )}

            {activeTab === "info" && (
                <div className="profile-videos">

                    <div className="profile-empty">
                        <div className="profile-empty-icon">ℹ️</div>

                        <p className="profile-empty-text">
                            {foodPartner?.address || "No address available"}
                        </p>

                        <p className="profile-empty-text" style={{ marginTop: "10px" }}>
                            {foodPartner?.contactNumber || "No contact available"}
                        </p>

                    </div>

                </div>
            )}

        </div>
    );
}

export default FoodPartnerProfile;