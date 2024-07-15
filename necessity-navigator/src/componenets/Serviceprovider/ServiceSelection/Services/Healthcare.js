import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadScript } from './loadScript';
import './HealthcareService.css';

const RegisterHealthcareService = () => {
    const [formData, setFormData] = useState({
        name: '',
        service_type: 'Hospital',
        address: '',
        latitude: '',
        longitude: '',
        contact_info: '',
        details: '',
        speciality: '',
        emergency_services: false,
        provide_home_service: false,
        provide_all_basic_tests: false,
        specific_tests: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleManualLocationSelect = (place) => {
        console.log('Selected place:', place);
        if (place.geometry) {
            const newLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            console.log('New location:', newLocation);
            setFormData((prevFormData) => ({
                ...prevFormData,
                address: place.formatted_address,
                latitude: newLocation.lat,
                longitude: newLocation.lng
            }));
        } else {
            console.error('Place has no geometry');
        }
    };

    useEffect(() => {
        const initAutocomplete = () => {
            const input = document.getElementById('autocomplete');
            if (window.google && window.google.maps && window.google.maps.places) {
                const autocomplete = new window.google.maps.places.Autocomplete(input);
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    handleManualLocationSelect(place);
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
        const submissionData = {
            ...formData,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude)
        };
        console.log('Submission data:', submissionData);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/provideraccounts/register-healthcare/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(submissionData),
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
                <h2>Register Healthcare Service</h2>
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
                    <label>Service Type:</label>
                    <select
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="Hospital">Hospital</option>
                        <option value="Clinic">Clinic</option>
                        <option value="Physiotherapist">Physiotherapist</option>
                        <option value="Lab">Lab</option>
                        <option value="Pharmacy">Pharmacy</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        id="autocomplete"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label>Details:</label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        placeholder='Add minimal details of you service for customer'
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Speciality:</label>
                    <input
                        type="text"
                        name="speciality"
                        placeholder='What your hospital clinic lab or you specialise in'
                        value={formData.speciality}
                        onChange={handleChange}
                    />
                </div>
                {formData.service_type === 'Hospital' && (
                    <div className="form-group">
                        <label>Emergency Services Available:</label>
                        <input
                            type="checkbox"
                            name="emergency_services"
                            checked={formData.emergency_services}
                            onChange={handleChange}
                        />
                    </div>
                )}
                {formData.service_type === 'Lab' && (
                    <>
                        <div className="form-group">
                            <label>Provide Home Service:</label>
                            <input
                                type="checkbox"
                                name="provide_home_service"
                                checked={formData.provide_home_service}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Provide All Basic Tests:</label>
                            <input
                                type="checkbox"
                                name="provide_all_basic_tests"
                                checked={formData.provide_all_basic_tests}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Specific Tests:</label>
                            <textarea
                                name="specific_tests"
                                value={formData.specific_tests}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </>
                )}
                {error && <p className="error">{error}</p>}
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default RegisterHealthcareService;
