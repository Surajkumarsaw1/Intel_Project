import React, { useState, useEffect } from 'react';
import './LocationPicker.css';
import { loadScript } from '../utils/loadScript';

const LocationPicker = ({ onClose, onLocationUpdate }) => {
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [manualLocation, setManualLocation] = useState('');
    const [location, setLocation] = useState({ lat: null, lng: null });

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setLocation(newLocation);
                    setUseCurrentLocation(true);
                    localStorage.setItem('location', JSON.stringify(newLocation));
                    onLocationUpdate(newLocation);
                    onClose();
                },
                (error) => {
                    alert("Error getting current location");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleManualLocationSelect = (place) => {
        const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };
        setLocation(newLocation);
        setUseCurrentLocation(false);
        localStorage.setItem('location', JSON.stringify(newLocation));
        onLocationUpdate(newLocation);
        onClose();
    };

    useEffect(() => {
        const initAutocomplete = () => {
            const input = document.getElementById('autocomplete');
            const autocomplete = new window.google.maps.places.Autocomplete(input);

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    handleManualLocationSelect(place);
                }
            });
        };

        const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        if (apiKey) {
            loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`, initAutocomplete);
        } else {
            console.error('Google Maps API key is missing');
        }
    }, []);

    return (
        <div className="location-picker-modal">
            <div className="location-picker">
                <h2>Choose Your Location</h2>
                <div>
                    <button onClick={handleCurrentLocation}>Use Current Location</button>
                </div>
                <div>
                    <input
                        type="text"
                        value={manualLocation}
                        onChange={(e) => setManualLocation(e.target.value)}
                        placeholder="Enter a location"
                        id="autocomplete"
                    />
                </div>
                {location.lat && location.lng && (
                    <div className='display'>
                        <p>Selected Location:</p>
                        <p>Latitude: {location.lat}</p>
                        <p>Longitude: {location.lng}</p>
                    </div>
                )}
                <div>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
