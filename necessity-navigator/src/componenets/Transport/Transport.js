import React from "react";
import { useNavigate } from 'react-router-dom';
import './Transport.css';

function Transport() {
    const navigate = useNavigate();

    const handlePickAndDropClick = () => {
        navigate('/home/transport/pickndrop');
    };

    const handleRentalsClick = () => {
        navigate('/home/transport/rentals');
    };

    const handleFlightClick = () => {
        navigate('/home/transport/flight');
    };

    return (
        <div className="transport-container">
            <h1>To ensure smooth travels we provide information for</h1>
            <div className="serv-container">
                <div className="service-box pickndrop" onClick={handlePickAndDropClick}>
                    <span className='service-text'>Pick and Drop</span>
                </div>
                <div className="service-box rentals" onClick={handleRentalsClick}>
                    <span className='service-text'>Vehicle Rentals</span>
                </div>
                <div className="service-box flight" onClick={handleFlightClick}>
                    <span className='service-text'>Flight</span>
                </div>
            </div>
        </div>
    );
}

export default Transport;
