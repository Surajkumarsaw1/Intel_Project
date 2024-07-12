import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RentalService.css';  // Assuming you have a CSS file for styling

const RentalService = () => {
    const [rentalServices, setRentalServices] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const location = JSON.parse(localStorage.getItem('location'));
        if (location) {
            const { lat, lng } = location;
            axios.get('http://localhost:8000/api/transport/rental/', {
                params: { lat, lng }
            }).then(response => {
                setRentalServices(response.data.services);
            }).catch(error => {
                setError('Error fetching rental vehicle services.');
                console.log(error);
            });
        } else {
            setError('Location not found in local storage.');
        }
    }, []);

    return (
        <div className="rental-vehicle-container">
            <h1>Rental Vehicle Services</h1>
            {error ? (
                <p>{error}</p>
            ) : (
                <div className="rental-service-list">
                    {rentalServices.map(service => (
                        <div key={service.id} className="rental-service-card">
                            <h2>{service.name}</h2>
                            <p><strong>Address:</strong> {service.address}</p>
                            <p><strong>Contact:</strong> {service.contact_info}</p>
                            <div className="rental-vehicles">
                                <p><strong>Rents:</strong></p>
                                <ul>
                                    {service.cars && <li>Car</li>}
                                    {service.bikes && <li>Bike</li>}
                                    {service.scooty && <li>Scooty</li>}
                                    {service.suvs && <li>SUV</li>}
                                </ul>
                            </div>
                            <p><strong>Pricing Range per Hour:</strong> ₹{service.avg_price_range_per_hour}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RentalService;
