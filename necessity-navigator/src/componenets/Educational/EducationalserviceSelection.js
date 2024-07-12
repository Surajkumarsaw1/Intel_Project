import React, { useState, useEffect } from 'react';
import EducationalServiceList from './EducationalServiceList';
import './EducationalserviceSelection.css';
import ManualdataSchoolList from './SchoolcFromDB';
import LocationPicker from '../LocationPicker';

const ServiceSelectionPage = () => {
    const [selectedService, setSelectedService] = useState('');
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    useEffect(() => {
        const storedLocation = localStorage.getItem('location');
        if (!storedLocation) {
            setShowLocationPicker(true);
        }
    }, []);

    const handleServiceClick = (serviceType) => {
        setSelectedService(serviceType);
    };

    const handleCloseLocationPicker = () => {
        setShowLocationPicker(false);

    };

    const handleLocationUpdate = (newLocation) => {
        console.log("Location updated:", newLocation);

    };

    return (
        <div className="service-selection-container">
            <h2>Select a Service Type</h2>
            <div className="service-options">
                <div className="service-option" onClick={() => handleServiceClick('school')}>
                    <div className="service-image school-image"></div>
                    <p>Schools</p>
                </div>
                <div className="service-option" onClick={() => handleServiceClick('tutor')}>
                    <div className="service-image tutor-image"></div>
                    <p>Tutors</p>
                </div>
                <div className="service-option" onClick={() => handleServiceClick('educational aid')}>
                    <div className="service-image aid-image"></div>
                    <p>Educational Aids</p>
                </div>
            </div>
            {selectedService === 'school' && <ManualdataSchoolList />}
            {selectedService && (
                <EducationalServiceList serviceType={selectedService} />
            )}
            {showLocationPicker && (
                <LocationPicker
                    onClose={handleCloseLocationPicker}
                    onLocationUpdate={handleLocationUpdate}
                />
            )}
        </div>
    );
};

export default ServiceSelectionPage;
