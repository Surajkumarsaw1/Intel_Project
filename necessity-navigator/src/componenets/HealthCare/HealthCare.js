import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './HealthCare1.css';
import LocationPicker from '../LocationPicker';

const HealthcareFacilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [nearestHospital, setNearestHospital] = useState(null);
    const [nearestPharmacy, setNearestPharmacy] = useState(null);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [facilityDetails, setFacilityDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [localServices, setLocalServices] = useState([]);
    const [distances, setDistances] = useState({});
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const location = JSON.parse(localStorage.getItem('location'));
    const facilitiesListRef = useRef(null);

    useEffect(() => {
        if (location && loading) {
            fetchFacilities(location);
        } else if (!location) {
            setShowLocationPicker(true);
        }
    }, [location, loading]);

    const fetchFacilities = async (location) => {
        try {
            const response = await axios.post('http://localhost:8000/api/health_facilities/', location);
            const data = response.data;
            setFacilities(data.facilities);
            setLocalServices(data.nearby_healthcare_services);
            setLoading(false);

            calculateDistances(location, data.facilities, data.nearby_healthcare_services);

        } catch (error) {
            alert('Error fetching facilities');
            setLoading(false);
        }
    };

    const calculateDistances = async (location, facilities, localServices) => {
        try {
            const response = await axios.post('http://localhost:8000/api/calculate_distance/', {
                location,
                services: facilities,
                local_services: localServices,
            });
            const data = response.data;
            const updatedServices = data.services;

            const updatedDistances = {};
            setNearestHospital(data.nearest_hospital);
            setNearestPharmacy(data.nearest_pharmacy);
            updatedServices.forEach(service => {
                updatedDistances[service.place_id || service.name] = service.distance;
            });
            setDistances(updatedDistances);
        } catch (error) {
            console.error('Error calculating distances:', error);
        }
    };

    const fetchFacilityDetails = async (place_id) => {
        try {
            const response = await axios.post('http://localhost:8000/api/health_facilities/details/', { place_id });
            setFacilityDetails(response.data);
        } catch (error) {
            alert('Error fetching facility details');
        }
    };

    const handleFacilityClick = (facility) => {
        setSelectedFacility(facility);
        fetchFacilityDetails(facility.place_id);
    };

    const handleLocationUpdate = (newLocation) => {
        fetchFacilities(newLocation);
    };

    return (
        <div className="container">
            {showLocationPicker && (
                <LocationPicker
                    onClose={() => setShowLocationPicker(false)}
                    onLocationUpdate={handleLocationUpdate}
                />
            )}
            {!showLocationPicker && (
                <div className="demo">
                    <div className="row">
                        <div className="healthcare-container">
                            <h2>Healthcare Facilities Near You</h2>
                            <div className="scroll-container">
                                <div className="facilities-list-container" ref={facilitiesListRef}>
                                    {facilities.map((facility, index) => (
                                        <div
                                            key={index}
                                            className="facility-item"
                                            onClick={() => handleFacilityClick(facility)}
                                        >
                                            <h3>{facility.name}</h3>
                                            <p><span>Type:</span> {facility.type}</p>
                                            <p><span>Address:</span> {facility.address}</p>
                                            <p><span>Rating:</span> {facility.rating}</p>
                                            <p><span>Distance:</span> {distances[facility.place_id || facility.name] || facility.distance || 'Calculating...'} km</p>
                                            <p><span>Is open:</span> {facility.open_now ? 'Yes' : 'No'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="additional-info">
                            <h2>More Details</h2>
                            {facilityDetails && selectedFacility ? (
                                <div className="facility-details">
                                    <h3>{selectedFacility.name}</h3>
                                    <p><span>Contact:</span> {facilityDetails.contact}</p>
                                    <p><span>Pricing:</span> {facilityDetails.price_level}</p>
                                    <p><span>Timing:</span> {facilityDetails.opening_hours}</p>
                                    {facilityDetails.reviews.length > 0 ? (
                                        <div className='review'>
                                            <span>Reviews:</span>
                                            {facilityDetails.reviews.map((review, index) => (
                                                <div key={index} className="review-item">
                                                    <p><strong>Author:</strong> {review.author_name}</p>
                                                    <p><strong>Rating:</strong> {review.rating}</p>
                                                    <p><strong>Text:</strong> {review.text}</p>
                                                    <p><strong>Relative Time:</strong> {review.relative_time_description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No review available.</p>
                                    )}
                                </div>
                            ) : (
                                <p>Select a facility to see more details.</p>
                            )}
                        </div>
                    </div>
                    <div className="best-facilities-container row">
                        <div className="best-facility">
                            <h2>Nearest Hospital</h2>
                            {nearestHospital ? (
                                <div className="facility-item">
                                    <h3>{nearestHospital.name}</h3>
                                    <p><span>Type:</span> {nearestHospital.type}</p>
                                    <p><span>Address:</span> {nearestHospital.address}</p>
                                    <p><span>Rating:</span> {nearestHospital.rating}</p>
                                    <p><span>Distance:</span> {distances[nearestHospital.place_id || nearestHospital.name] || nearestHospital.distance || 'Calculating...'} km</p>
                                    <p><span>Is open:</span> {nearestHospital.open_now ? 'Yes' : 'No'}</p>
                                </div>
                            ) : (
                                <p>No hospital data available.</p>
                            )}
                        </div>
                        <div className="best-facility">
                            <h2>Nearest Pharmacy</h2>
                            {nearestPharmacy ? (
                                <div className="facility-item">
                                    <h3>{nearestPharmacy.name}</h3>
                                    <p><span>Type:</span> {nearestPharmacy.type}</p>
                                    <p><span>Address:</span> {nearestPharmacy.address}</p>
                                    <p><span>Rating:</span> {nearestPharmacy.rating}</p>
                                    <p><span>Distance:</span> {distances[nearestPharmacy.place_id || nearestPharmacy.name] || nearestPharmacy.distance || 'Calculating...'} km</p>
                                    <p><span>Is open:</span> {nearestPharmacy.open_now ? 'Yes' : 'No'}</p>
                                </div>
                            ) : (
                                <p>No pharmacy data available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthcareFacilities;
