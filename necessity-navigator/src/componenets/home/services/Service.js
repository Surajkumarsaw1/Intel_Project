import React from 'react';
import './Service.css';

const Service = ({ icon, title, description, details, className }) => {
    return (
        <div className="service">
            <img src={icon} alt={title} className='serviceIcon' />
            <h3 className='serviceTitle'>{title}</h3>
            <p className='serviceDescription'>{description}</p>

        </div>
    );
};

export default Service;
