import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import React from 'react'
import UserRegister from "../pages/UserRegister"
import UserLogin from "../pages/UserLogin"
import FoodPartnerRegister from "../pages/FoodPartnerRegister"
import FoodPartnerLogin from "../pages/FoodPartnerLogin"
import Home from "../pages/Home"
import Feed from "../pages/Feed"
import FoodPartnerDashboard from '../pages/FoodPartnerDashboard'
import FoodPartnerProfile from '../pages/FoodPartnerProfile'
import UserProfile from '../pages/UserProfile'

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                <Route path="/home" element={<Home />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/food-partner/dashboard" element={<FoodPartnerDashboard />} />
                <Route path="/food-partner/:id" element={<FoodPartnerProfile />} />
                <Route path="*" element={<Navigate to="/user/register" replace />} />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes
