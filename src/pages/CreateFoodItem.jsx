import React, { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import "./createFoodItem.css";

function CreateFoodItem({ onClose, onSuccess }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const videoInputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [videoPreview]);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("video/")) {
            setError("Please upload a valid video file");
            return;
        }

        if (file.size > 30 * 1024 * 1024) {
            setError("Video must be under 30MB");
            return;
        }

        setError(null); // clear previous errors
        setVideo(file);

        const url = URL.createObjectURL(file);
        setVideoPreview(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Please enter a food name");
            return;
        }

        if (!video) {
            setError("Please select a video");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("video", video);

            const response = await api.post("/food", formData);

            if (response.status === 201) {
                if (onSuccess) {
                    onSuccess(response.data.food);
                }

                handleClose();
            }
        } catch (err) {
            console.error("Error creating food item:", err);

            setError(
                err.response?.data?.message || "Failed to create food item"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
        }

        if (onClose) {
            onClose();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const removeVideo = (e) => {
        e.stopPropagation();

        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
        }

        setVideo(null);
        setVideoPreview(null);
    };

    return (
        <div className="create-food-overlay" onClick={handleOverlayClick}>
            <div className="create-food-modal">
                <div className="create-food-header">
                    <h2>Create New Food Item</h2>
                    <button className="close-btn" onClick={handleClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="create-food-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Food Name *</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter food name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter food description"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Video *</label>

                        <div
                            className="video-upload-area"
                            onClick={() => videoInputRef.current?.click()}
                        >
                            {videoPreview ? (
                                <div className="video-preview-container">
                                    <video
                                        src={videoPreview}
                                        className="video-preview"
                                        muted
                                        loop
                                        autoPlay
                                    />

                                    <button
                                        type="button"
                                        className="remove-video-btn"
                                        onClick={removeVideo}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="upload-placeholder">
                                    <span className="upload-icon">🎬</span>
                                    <p>Click to upload video</p>
                                    <span className="upload-hint">
                                        MP4, WebM supported (max 30MB)
                                    </span>
                                </div>
                            )}

                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                style={{ display: "none" }}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Food Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateFoodItem;