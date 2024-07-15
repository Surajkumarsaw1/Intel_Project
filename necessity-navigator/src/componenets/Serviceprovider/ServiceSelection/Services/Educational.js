import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadScript } from './loadScript';
import './EducationalService.css';

const RegisterEducationalService = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        contact_info: '',
        details: '',
        service_type: '',
        grade_range: '',
        streams: [],
        board: '',
        sports_facility: false,
        computer_lab: false,
        library: false,
        subjects: '',
        avg_pricing: '',
        hours: '',
        aid_type: '',
        sell_or_donate: 'sell'
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
        if (name === 'streams') {
            const streams = Array.from(e.target.selectedOptions, (option) => option.value);
            setFormData({
                ...formData,
                [name]: streams
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/provideraccounts/register-educational/', {
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
        <div className="register-edu-container">
            <form onSubmit={handleSubmit} className="register-edu-form">
                <h2>Register Educational Service</h2>
                <div className="form-group-edu">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group-edu">
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
                <div className="form-group-edu">
                    <label>Type of Service:</label>
                    <select
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Service Type</option>
                        <option value="school">School</option>
                        <option value="tutor">Tutor</option>
                        <option value="educational aid">Educational Aid</option>
                    </select>
                </div>
                {formData.service_type === 'school' && (
                    <>
                        <div className="form-group-edu">
                            <label>Grade Range:</label>
                            <input
                                type="text"
                                name="grade_range"
                                value={formData.grade_range}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-edu">
                            <label>Streams:</label>
                            <select
                                name="streams"
                                value={formData.streams}
                                onChange={handleChange}
                                multiple
                                required
                            >
                                <option value="PCM">PCM</option>
                                <option value="PCMB">PCMB</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Humanities">Humanities</option>
                            </select>
                        </div>
                        <div className="form-group-edu">
                            <label>Board:</label>
                            <select
                                name="board"
                                value={formData.board}
                                onChange={handleChange}
                                required
                            >
                                <option value="ICSE">ICSE</option>
                                <option value="CBSE">CBSE</option>
                                <option value="State Board">State Board</option>
                            </select>
                        </div>
                        <div className="form-group-edu">
                            <label>Sports Facility:</label>
                            <input
                                type="checkbox"
                                name="sports_facility"
                                checked={formData.sports_facility}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group-edu">
                            <label>Computer Lab:</label>
                            <input
                                type="checkbox"
                                name="computer_lab"
                                checked={formData.computer_lab}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group-edu">
                            <label>Library:</label>
                            <input
                                type="checkbox"
                                name="library"
                                checked={formData.library}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}
                {formData.service_type === 'tutor' && (
                    <>
                        <div className="form-group-edu">
                            <label>Subjects:</label>
                            <input
                                type="text"
                                name="subjects"
                                value={formData.subjects}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-edu">
                            <label>Average Pricing:</label>
                            <input
                                type="text"
                                name="avg_pricing"
                                value={formData.avg_pricing}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-edu">
                            <label>Hours:</label>
                            <input
                                type="text"
                                name="hours"
                                value={formData.hours}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}
                {formData.service_type === 'educational aid' && (
                    <>
                        <div className="form-group-edu">
                            <label>Aid Type:</label>
                            <select
                                name="aid_type"
                                value={formData.aid_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="Study Material">Provide Study Material</option>
                                <option value="Tech Facilities">Provide Tech Facilities</option>
                            </select>
                        </div>
                        <div className="form-group-edu">
                            <label>Sell or Donate:</label>
                            <select
                                name="sell_or_donate"
                                value={formData.sell_or_donate}
                                onChange={handleChange}
                                required
                            >
                                <option value="sell">Sell</option>
                                <option value="donate">Donate</option>
                            </select>
                        </div>
                    </>
                )}
                <div className="form-group-edu">
                    <label>Contact Info:</label>
                    <input
                        type="text"
                        name="contact_info"
                        value={formData.contact_info}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group-edu">
                    <label>Details:</label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        placeholder="Add minimal details of your service to display to customer"
                        required
                    />
                </div>
                {error && <p className="error-edu">{error}</p>}
                <button type="submit" className="submit-button-edu">Submit</button>
            </form>
        </div>
    );
};

export default RegisterEducationalService;
