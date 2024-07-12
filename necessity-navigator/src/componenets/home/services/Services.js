import React from 'react';
import Service from './Service';
import './Services.css';
import { Link } from 'react-router-dom';

const Services = () => {
    return (
        <div className="services">
            <h1>Current Services</h1>
            <div className="serviceWrapper">
                <Link to="/home/healthcare" className="serviceLink">
                    <div className="serviceContainer">
                        <Service
                            icon="https://img.freepik.com/premium-vector/medical-minimal-thin-line-icons-set_36298-256.jpg"
                            title="Healthcare"
                            description="Find the best healthcare providers and services near you."
                            className="healthcareIcon"
                        />
                    </div>
                </Link>
                <Link to="/home/education" className='serviceLink'>
                    <div className="serviceContainer">
                        <Service
                            icon="https://static.vecteezy.com/system/resources/previews/002/220/362/non_2x/education-minimal-thin-line-icons-set-vector.jpg"
                            title="Education"
                            description="Explore top educational institutions and resources."
                            className="educationIcon"
                        />
                    </div>
                </Link>
                <Link to="/home/transport" className="serviceLink">

                    <div className="serviceContainer">
                        <Service
                            icon="https://img.freepik.com/premium-vector/transportation-minimal-thin-line-icons-set_36298-294.jpg?w=1480"
                            title="Transport"
                            description="Get information on transport options and schedules."
                            className="transportIcon"
                        />
                    </div>
                </Link>
                <Link to="/home/banking" className='serviceLink'>
                    <div className="serviceContainer">
                        <Service
                            icon="https://static.vecteezy.com/system/resources/previews/002/236/331/non_2x/banking-minimal-thin-line-icons-set-vector.jpg"
                            title="Banking"
                            description="Access reliable banking facilities and services."
                            className="bankIcon"
                        />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Services;
