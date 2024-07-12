import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import './ServiceSelection.css';

const ServiceSelection = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const handleServiceSelection = (serviceType) => {

        navigate(`/service_provider/register/${serviceType}`);
    };



    return (
        <div className="service-selection-container">
            <h2>Select Your Service Type</h2>
            <p>Choose the sector in which you provide your service:</p>
            <div className="service-buttons">
                <button onClick={() => handleServiceSelection('healthcare')} className="service-button healthcare">
                    Healthcare
                </button>
                <button onClick={() => handleServiceSelection('transport')} className="service-button transport">
                    Transport
                </button>
                <button onClick={() => handleServiceSelection('educational')} className="service-button educational">
                    Education
                </button>
            </div>
        </div>
    );
};

export default ServiceSelection;
