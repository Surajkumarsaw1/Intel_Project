import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManualdataSchoolList = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('state');
    const [visibleCount, setVisibleCount] = useState(10);
    const location = JSON.parse(localStorage.getItem('location'));

    const fetchServices = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/educational/global-schools/',
                { ...location, filter },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    withCredentials: true,
                });
            const data = response.data;
            setServices(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch services');
        }
    };

    useEffect(() => {
        fetchServices();
    }, [filter]);

    const loadMore = () => {
        setVisibleCount((prevCount) => prevCount + 10);
    };

    const showLess = () => {
        setVisibleCount(10);
    };

    return (
        <div className="service-list">
            <h2>Educational Services</h2>
            {error && <p className="error">{error}</p>}
            <div>
                <label htmlFor="filter">Filter by: </label>
                <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="state">State</option>
                    <option value="district">District</option>
                    <option value="block">Block</option>
                </select>
            </div>
            <ul>
                {services.slice(0, visibleCount).map((service) => (
                    <li key={service['UDISE Code']}>
                        <h3>{service.SchoolName}</h3>
                        <p><strong>State:</strong> {service.State}</p>
                        <p><strong>District:</strong> {service.District}</p>
                        <p><strong>Block:</strong> {service.Block}</p>
                        <p><strong>School Management:</strong> {service['School Management']}</p>
                        <p><strong>School Type:</strong> {service['School Type']}</p>
                        <p><strong>Library Availability:</strong> {service['Library Availability']}</p>
                        <p><strong>Playground Available:</strong> {service['Playground Available']}</p>
                        <p><strong>ICT Lab:</strong> {service['ICT Lab']}</p>
                    </li>
                ))}
            </ul>
            {visibleCount < services.length && (
                <button onClick={loadMore}>Load More</button>
            )}
            {visibleCount >= services.length && (
                <p>End of list</p>
            )}
            {visibleCount > 10 && (
                <button onClick={showLess}>Show Less</button>
            )}
        </div>
    );
};

export default ManualdataSchoolList;
