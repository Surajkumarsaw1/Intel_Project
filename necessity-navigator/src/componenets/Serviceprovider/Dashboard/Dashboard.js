import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaCar, FaHospital, FaSchool } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState({ username: '', email: '' });
    const [services, setServices] = useState({
        transport_services: [],
        healthcare_services: [],
        education_services: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8000/provideraccounts/profile/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                });

                if (!response.ok) {
                    alert('please login to proceed');
                    navigate('/service_provider/login')
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error.message);
            }
        };

        const fetchUserServices = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8000/provideraccounts/profile/services/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user services');
                }

                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching user services:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchUserServices();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/service_provider/auth');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </header>
            <section className="user-info">
                <div className="user-avatar">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png" alt="User Avatar" />
                </div>
                <div className="user-details">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            </section>
            <section className="services-section">
                <h2>Services Provided</h2>
                {Object.values(services).every(serviceList => serviceList?.length === 0) ? (
                    <p>No services available</p>
                ) : (
                    <Tabs>
                        <TabList>
                            {services.transport_services.length > 0 && <Tab><FaCar /> Transport Services</Tab>}
                            {services.healthcare_services.length > 0 && <Tab><FaHospital /> Healthcare Services</Tab>}
                            {services.education_services.length > 0 && <Tab><FaSchool /> Education Services</Tab>}
                        </TabList>

                        {services.transport_services.length > 0 && (
                            <TabPanel>
                                <div className="services-container">
                                    {services.transport_services.map(service => (
                                        <div key={service.id} className="service-card">
                                            <strong>Name:</strong> {service.name}<br />
                                            <strong>Type:</strong> {service.type_of_service === 'PD' ? 'Pick and Drop' : 'Vehicle Rental'}<br />
                                            <strong>Address:</strong> {service.address}<br />
                                            <strong>Contact:</strong> {service.contact_info}<br />
                                            {service.type_of_service === 'PD' ? (
                                                <>
                                                    <strong>Avg Price per km:</strong> ₹{service.price_per_km}<br />
                                                </>
                                            ) : (
                                                <>
                                                    <strong>Rents:</strong>
                                                    <ul>
                                                        {service.cars && <li>Car</li>}
                                                        {service.bikes && <li>Bike</li>}
                                                        {service.scooty && <li>Scooty</li>}
                                                        {service.suvs && <li>SUV</li>}
                                                    </ul>
                                                    <strong>Avg Pricing per Hour:</strong> ₹{service.avg_price_range_per_hour}<br />
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                            </TabPanel>
                        )}

                        {services.healthcare_services.length > 0 && (
                            <TabPanel>
                                <div className="services-container">
                                    {services.healthcare_services.map(service => (
                                        <div key={service.id} className="service-card">
                                            <strong>Name:</strong> {service.name}<br />
                                            <strong>Type:</strong> {service.service_type}<br />
                                            {service.contact_info && <><strong>Contact Info:</strong> {service.contact_info}<br /></>}
                                            {service.service_type === 'Hospital' && service.emergency_services !== undefined && (
                                                <><strong>Emergency Services:</strong> {service.emergency_services ? 'Yes' : 'No'}<br /></>
                                            )}
                                            {service.service_type === 'Lab' && (
                                                <>
                                                    {service.provide_home_service !== undefined && (
                                                        <><strong>Home Service:</strong> {service.provide_home_service ? 'Yes' : 'No'}<br /></>
                                                    )}
                                                    {service.provide_all_basic_tests !== undefined && (
                                                        <><strong>Basic Tests:</strong> {service.provide_all_basic_tests ? 'Yes' : 'No'}<br /></>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </TabPanel>
                        )}

                        {services.education_services.length > 0 && (
                            <TabPanel>
                                <div className="services-container">
                                    {services.education_services.map(service => (
                                        <div key={service.id} className="service-card">
                                            <strong>Name:</strong> {service.name}<br />
                                            <strong>Type:</strong> {service.service_type}<br />
                                            {service.service_type === 'school' && (
                                                <>
                                                    <strong>Grade Range:</strong> {service.grade_range}<br />
                                                    <strong>Streams:</strong> {service.streams.join(', ')}<br />
                                                    <strong>Board:</strong> {service.board}<br />
                                                    <strong>Sports Facility:</strong> {service.sports_facility ? 'Yes' : 'No'}<br />
                                                    <strong>Computer Lab:</strong> {service.computer_lab ? 'Yes' : 'No'}<br />
                                                    <strong>Library:</strong> {service.library ? 'Yes' : 'No'}<br />
                                                </>
                                            )}
                                            {service.service_type === 'tuition' && (
                                                <>
                                                    <strong>Subjects:</strong> {service.subjects}<br />
                                                    <strong>Average Pricing:</strong> {service.avg_pricing}<br />
                                                    <strong>Hours:</strong> {service.hours}<br />
                                                </>
                                            )}
                                            {service.service_type === 'educational aid' && (
                                                <>

                                                    <strong>Sell or Donate:</strong> {service.sell_or_donate}<br />
                                                    <strong>Details:</strong> {service.details}<br />

                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </TabPanel>
                        )}
                    </Tabs>
                )}
            </section>
            <button className="add-service-button" onClick={() => navigate('/service_provider/service-selection')}>Add Service</button>
        </div>
    );
};

export default Dashboard;
