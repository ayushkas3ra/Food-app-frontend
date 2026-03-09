import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import './userProfile.css';

function UserProfile() {
    const [user, setUser] = useState(null);
    const [savedFoods, setSavedFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('saved');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);

            // Fetch user info
            const userResponse = await axios.get('http://localhost:3000/api/user/profile', {
                withCredentials: true
            });

            // Fetch saved foods
            const savedResponse = await axios.get('http://localhost:3000/api/food/saved', {
                withCredentials: true
            });

            setUser(userResponse.data.user);
            setSavedFoods(savedResponse.data.savedFoods || []);
        } catch (err) {
            console.error('Error fetching user data:', err);
            if (err.response?.status === 401) {
                window.location.href = '/user/login';
            } else {
                setError('Failed to load profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/api/auth/user/logout', {}, {
                withCredentials: true
            });
            window.location.href = '/user/login';
        } catch (err) {
            console.error('Logout error:', err);
        }
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
        <div className="user-profile">
            {/* Profile Header */}
            <div className="user-profile-header">
                <div className="user-profile-pic-container">
                    {user?.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="user-profile-pic" />
                    ) : (
                        <div className="user-profile-pic-placeholder">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    )}
                </div>

                <div className="user-profile-info">
                    <h1 className="user-profile-name">{user?.name || 'User'}</h1>
                    <p className="user-profile-email">{user?.email || ''}</p>

                    <div className="user-profile-stats">
                        <div className="user-stat-item">
                            <span className="user-stat-value">{savedFoods.length}</span>
                            <span className="user-stat-label">Saved</span>
                        </div>
                        <div className="user-stat-item">
                            <span className="user-stat-value">0</span>
                            <span className="user-stat-label">Orders</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="user-profile-actions">
                <button className="user-edit-btn" onClick={() => window.location.href = '/user/edit-profile'}>
                    Edit Profile
                </button>
                <button className="user-logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="user-profile-tabs">
                <button
                    className={`user-profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Saved
                </button>
                <button
                    className={`user-profile-tab ${activeTab === 'liked' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liked')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Liked
                </button>
            </div>

            {/* Content Grid */}
            <div className="user-profile-content">
                {activeTab === 'saved' && (
                    savedFoods.length > 0 ? (
                        <div className="user-videos-grid">
                            {savedFoods.map((food) => (
                                <div
                                    key={food._id}
                                    className="user-video-item"
                                    onClick={() => window.location.href = `/food/${food._id}`}
                                >
                                    <video
                                        src={food.video}
                                        className="user-video-thumbnail"
                                        muted
                                        preload="metadata"
                                    />
                                    <div className="user-video-overlay">
                                        <span className="user-video-title">{food.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="user-profile-empty">
                            <div className="user-profile-empty-icon">📂</div>
                            <p>No saved food items yet</p>
                            <button
                                className="user-browse-btn"
                                onClick={() => window.location.href = '/feed'}
                            >
                                Browse Food
                            </button>
                        </div>
                    )
                )}

                {activeTab === 'liked' && (
                    <div className="user-profile-empty">
                        <div className="user-profile-empty-icon">❤️</div>
                        <p>No liked food items yet</p>
                        <button
                            className="user-browse-btn"
                            onClick={() => window.location.href = '/feed'}
                        >
                            Browse Food
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav currentFoodId={null} isSaved={false} />
        </div>
    );
}

export default UserProfile;

