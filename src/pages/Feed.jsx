import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import BottomNav from "../components/BottomNav";
import "./feed.css";

function Feed() {
    const [foods, setFoods] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [likedVideos, setLikedVideos] = useState({});
    const [likeCounts, setLikeCounts] = useState({});

    const videoRefs = useRef([]);
    const observerRef = useRef(null);

    const navigate = useNavigate();

    const fetchFoods = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("/food?page=1&limit=10");

            const foodItems = response.data.foodItems || [];

            setFoods(foodItems);

            const initialLikes = {};
            const initialLikeCounts = {};

            foodItems.forEach((food) => {
                initialLikes[food._id] = false;
                initialLikeCounts[food._id] = food.likeCount || 0;
            });

            setLikedVideos(initialLikes);
            setLikeCounts(initialLikeCounts);
        } catch (error) {
            console.error("Error fetching foods:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    useEffect(() => {
        if (foods.length === 0) return;

        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.6,
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                const index = parseInt(video.dataset.index, 10);

                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                    setCurrentIndex(index);
                } else {
                    video.pause();
                }
            });
        }, options);

        videoRefs.current.forEach((video) => {
            if (video && observerRef.current) {
                observerRef.current.observe(video);
            }
        });

        return () => {
            if (observerRef.current) {
                videoRefs.current.forEach((video) => {
                    if (video) observerRef.current.unobserve(video);
                });
                observerRef.current.disconnect();
            }
        };
    }, [foods]);

    useEffect(() => {
        if (foods.length > 0 && videoRefs.current[0]) {
            videoRefs.current[0].play().catch(() => { });
        }
    }, [foods]);

    const handleVisitStore = (foodPartnerId) => {
        navigate(`/food-partner/${foodPartnerId}`);
    };

    const handleLike = async (foodId) => {
        try {
            await api.post("/food/like", { foodId });

            setLikedVideos((prev) => ({
                ...prev,
                [foodId]: !prev[foodId],
            }));

            setLikeCounts((prev) => ({
                ...prev,
                [foodId]: prev[foodId] ? prev[foodId] - 1 : prev[foodId] + 1,
            }));
        } catch (err) {
            console.error("Like failed", err);
        }
    };

    const handleComment = (foodId) => {
        alert(`Open comments for video: ${foodId}`);
    };

    const handleShare = (foodId) => {
        const shareUrl = window.location.origin + `/food/${foodId}`;

        if (navigator.share) {
            navigator
                .share({
                    title: "Check out this food!",
                    url: shareUrl,
                })
                .catch(() => { });
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
        }
    };

    const handleOrderNow = (food) => {
        alert(`Order: ${food.name}`);
    };

    return (
        <div className="feed-container">
            {loading ? (
                <div className="feed-empty">
                    <p>Loading...</p>
                </div>
            ) : error ? (
                <div className="feed-empty">
                    <p>Error: {error}</p>
                </div>
            ) : foods.length === 0 ? (
                <div className="feed-empty">
                    <p>No videos available</p>
                </div>
            ) : (
                foods.map((food, index) => (
                    <div
                        key={food._id}
                        className={`feed-video-card ${index === currentIndex ? "active" : ""
                            }`}
                    >
                        <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            data-index={index}
                            src={food.video}
                            className="feed-video"
                            loop
                            muted={index !== currentIndex}
                            playsInline
                            preload="metadata"
                        />

                        <div className="feed-overlay">
                            <div className="feed-content-top">
                                <h3 className="feed-title">{food.name}</h3>
                                <p className="feed-description">{food.description}</p>

                                <button
                                    className="feed-visit-btn"
                                    onClick={() => handleVisitStore(food.foodPartner)}
                                >
                                    Visit Store
                                </button>
                            </div>

                            <div className="feed-actions">
                                <div className="feed-action-item">
                                    <button
                                        className={`feed-action-btn ${likedVideos[food._id] ? "liked" : ""
                                            }`}
                                        onClick={() => handleLike(food._id)}
                                    >
                                        {likedVideos[food._id] ? "❤️" : "🤍"}
                                    </button>

                                    <span className="feed-action-count">
                                        {likeCounts[food._id]}
                                    </span>
                                </div>

                                <div className="feed-action-item">
                                    <button
                                        className="feed-action-btn"
                                        onClick={() => handleComment(food._id)}
                                    >
                                        💬
                                    </button>
                                    <span className="feed-action-count">0</span>
                                </div>

                                <div className="feed-action-item">
                                    <button
                                        className="feed-action-btn"
                                        onClick={() => handleShare(food._id)}
                                    >
                                        ➦
                                    </button>
                                    <span className="feed-action-count">Share</span>
                                </div>

                                <div className="feed-action-item">
                                    <button
                                        className="feed-action-btn order-now-btn"
                                        onClick={() => handleOrderNow(food)}
                                    >
                                        🛒
                                    </button>
                                    <span className="feed-action-count">Order</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {foods.length > 0 && currentIndex < foods.length && (
                <BottomNav
                    currentFoodId={foods[currentIndex]?._id}
                    isSaved={false}
                />
            )}
        </div>
    );
}

export default Feed;