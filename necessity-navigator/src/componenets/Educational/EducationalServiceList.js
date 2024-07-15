import React, { useState, useEffect } from 'react';
import ManualdataSchoolList from './SchoolcFromDB';
const EducationalServiceList = ({ serviceType }) => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem('token');
                let endpoint = '';

                if (serviceType === 'school') {
                    endpoint = 'http://localhost:8000/api/educational/schools/';
                } else if (serviceType === 'tutor') {
                    endpoint = 'http://localhost:8000/api/educational/tutors/';
                } else if (serviceType === 'educational aid') {
                    endpoint = 'http://localhost:8000/api/educational/aids/';
                }

                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.detail || 'Failed to fetch services');
                    return;
                }

                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to fetch services');
            }
        };

        fetchServices();
    }, [serviceType]);

    return (
        <div className="service-list">
            <h2>Local {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Services</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {services.map((service) => (
                    <li key={service.id}>
                        <h3>{service.name}</h3>
                        <p><strong>Address:</strong> {service.address}</p>
                        <p><strong>Contact Info:</strong> {service.contact_info}</p>
                        <p><strong>Details:</strong> {service.details}</p>
                        {serviceType === 'school' && (

                            <>
                                <p><strong>Grade Range:</strong> {service.grade_range}</p>
                                <p><strong>Streams:</strong> {service.streams.join(', ')}</p>
                                <p><strong>Board:</strong> {service.board}</p>
                                <p><strong>Sports Facility:</strong> {service.sports_facility ? 'Yes' : 'No'}</p>
                                <p><strong>Computer Lab:</strong> {service.computer_lab ? 'Yes' : 'No'}</p>
                                <p><strong>Library:</strong> {service.library ? 'Yes' : 'No'}</p>
                            </>
                        )}
                        {serviceType === 'tutor' && (
                            <>
                                <p><strong>Subjects Taught:</strong> {service.subjects_taught}</p>
                                <p><strong>Average Pricing:</strong> {service.avg_pricing}</p>
                                <p><strong>Hours per Day:</strong> {service.hours_per_day}</p>
                            </>
                        )}
                        {serviceType === 'educational aid' && (
                            <>
                                <p><strong>Aid Type:</strong> {service.aid_type}</p>
                                <p><strong>Sell or Donate:</strong> {service.sell_or_donate}</p>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EducationalServiceList;