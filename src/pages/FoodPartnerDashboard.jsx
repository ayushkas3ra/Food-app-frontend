import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import CreateFoodItem from "./CreateFoodItem";
import "./foodPartnerDashboard.css";

function FoodPartnerDashboard() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [playingVideoId, setPlayingVideoId] = useState(null);

    const videoRefs = useRef({});

    const fetchFoods = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("/food");

            setFoods(response.data.foodItems || []);
        } catch (err) {
            console.error("Error fetching foods:", err);
            setError("Failed to load food items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();

        return () => {
            Object.values(videoRefs.current).forEach((video) => {
                if (video) video.pause();
            });
        };
    }, []);

    const handleVideoClick = (foodId) => {
        const video = videoRefs.current[foodId];

        if (!video) return;

        if (playingVideoId === foodId) {
            video.pause();
            setPlayingVideoId(null);
        } else {
            Object.values(videoRefs.current).forEach((v) => v?.pause());

            video.play().catch(() => { });
            setPlayingVideoId(foodId);
        }
    };

    const handleCreateSuccess = (newFood) => {
        setFoods((prev) => [newFood, ...prev]);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Food Partner Dashboard</h1>

                <button
                    className="create-food-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Create Food Item
                </button>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <span className="stat-number">{foods.length}</span>
                    <span className="stat-label">Total Items</span>
                </div>

                <div className="stat-card">
                    <span className="stat-number">0</span>
                    <span className="stat-label">Total Orders</span>
                </div>

                <div className="stat-card">
                    <span className="stat-number">$0</span>
                    <span className="stat-label">Total Revenue</span>
                </div>
            </div>

            <div className="dashboard-content">
                <h2>Your Food Items</h2>

                {loading ? (
                    <div className="loading-state">Loading...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : foods.length === 0 ? (
                    <div className="empty-state">
                        <p>No food items yet. Create your first one!</p>

                        <button
                            className="create-food-btn-small"
                            onClick={() => setShowCreateModal(true)}
                        >
                            + Create Food Item
                        </button>
                    </div>
                ) : (
                    <div className="food-grid">
                        {foods.map((food) => (
                            <div key={food._id} className="food-card">
                                <div
                                    className="food-video-container"
                                    onClick={() => handleVideoClick(food._id)}
                                >
                                    <video
                                        ref={(el) => (videoRefs.current[food._id] = el)}
                                        src={food.video}
                                        className="food-video"
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                    />

                                    {playingVideoId !== food._id && (
                                        <div className="play-overlay">▶</div>
                                    )}
                                </div>

                                <div className="food-info">
                                    <h3>{food.name}</h3>
                                    <p>{food.description || "No description"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateFoodItem
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
}

export default FoodPartnerDashboard;