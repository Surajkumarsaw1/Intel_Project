import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <div className="hero">
            <img src="https://www.cdgi.com/wp-content/uploads/2018/03/Mobile-Phone-Apps-994x497.jpg" alt="Hero" />
            <div className="heroText">
                <h1>Your One-Stop Solution for Essential Services</h1>
                <p>Find reliable information on healthcare, education, transport, and banking all in one place.</p>
                <button className="cta">Get Started</button>
            </div>
        </div>
    );
};

export default Hero;
