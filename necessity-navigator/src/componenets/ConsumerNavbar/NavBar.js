import React, { useState } from "react";
import './NavBar.css'
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import LocationPicker from '../LocationPicker';

const ConsumerNavbar = () => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    const handleLogoutClick = () => {
        localStorage.clear();
        logout();
    }

    const handleLocationClick = () => {
        setShowLocationPicker(true);
    }

    const handleCloseLocationPicker = () => {
        setShowLocationPicker(false);
        window.location.reload();
    }

    const handleLocationUpdate = (newLocation) => {
        console.log("Location updated:", newLocation);
    }

    return (
        <div className="navbar">
            <h1>Utility Navigator</h1>
            {isAuthenticated ? (
                <ul>
                    <li><Link to={"/home"}>Home</Link></li>
                    <li onClick={handleLocationClick}>Location</li>
                    <li><Link to={"/home/healthcare"}>Healthcare</Link></li>
                    <li><button onClick={handleLogoutClick}>Logout</button></li>
                </ul>
            ) : (
                <ul>Login to proceed further</ul>
            )}
            {showLocationPicker && (
                <LocationPicker
                    onClose={handleCloseLocationPicker}
                    onLocationUpdate={handleLocationUpdate}
                />
            )}
        </div>
    );
}

export default ConsumerNavbar;
