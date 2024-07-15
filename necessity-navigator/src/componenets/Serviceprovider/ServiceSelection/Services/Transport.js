import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadScript } from './loadScript';
import './TransportService.css';

const RegisterTransportService = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        type_of_service: 'PD',
        vehicle_type: '',
        price_per_km: '',
        cars: false,
        bikes: false,
        scooty: false,
        suvs: false,
        avg_price_range_per_hour: '',
        contact_info: '',
        latitude: '',
        longitude: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleManualLocationSelect = (place) => {
        const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };
        setFormData({
            ...formData,
            address: place.formatted_address,
            latitude: newLocation.lat,
            longitude: newLocation.lng
        });
    };

    useEffect(() => {
        const initAutocomplete = () => {
            const input = document.getElementById('autocomplete');
            if (window.google && window.google.maps && window.google.maps.places) {
                const autocomplete = new window.google.maps.places.Autocomplete(input);
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry) {
                        handleManualLocationSelect(place);
                    }
                });
            } else {
                console.error('Google Maps JavaScript API not loaded properly');
            }
        };

        const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        if (apiKey) {
            loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`, initAutocomplete);
        } else {
            console.error('Google Maps API key is missing');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/provideraccounts/register-transport/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.detail) {
                    setError(errorData.detail);
                } else {
                    console.error('Error:', errorData);
                    setError('Failed to register service');
                }
                return;
            }

            navigate('/service_provider/dashboard');
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to register service');
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Register Transport Service</h2>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        id="autocomplete"
                        placeholder="Enter your address"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Type of Service:</label>
                    <select
                        name="type_of_service"
                        value={formData.type_of_service}
                        onChange={handleChange}
                        required
                    >
                        <option value="PD">Pick and Drop</option>
                        <option value="VR">Vehicle Rental</option>
                    </select>
                </div>
                {formData.type_of_service === 'PD' && (
                    <>
                        <div className="form-group">
                            <label>Vehicle Type:</label>
                            <input
                                type="text"
                                name="vehicle_type"
                                placeholder='Vehicle you will use for this service ex: auto , bike ,car etc'
                                value={formData.vehicle_type}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Price per KM:</label>
                            <input
                                type="number"
                                name="price_per_km"
                                placeholder='A estimated pricing'
                                value={formData.price_per_km}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}
                {formData.type_of_service === 'VR' && (
                    <>
                        <div className="form-group">
                            <label>Cars:</label>
                            <input
                                type="checkbox"
                                name="cars"
                                checked={formData.cars}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Bikes:</label>
                            <input
                                type="checkbox"
                                name="bikes"
                                checked={formData.bikes}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Scooty:</label>
                            <input
                                type="checkbox"
                                name="scooty"
                                checked={formData.scooty}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>SUVs:</label>
                            <input
                                type="checkbox"
                                name="suvs"
                                checked={formData.suvs}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Average Price Range per Hour:</label>
                            <input
                                type="number"
                                name="avg_price_range_per_hour"
                                value={formData.avg_price_range_per_hour}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}
                <div className="form-group">
                    <label>Contact Info:</label>
                    <input
                        type="text"
                        name="contact_info"
                        value={formData.contact_info}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default RegisterTransportService;
