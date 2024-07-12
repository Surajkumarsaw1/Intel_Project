import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const FancyLandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-container">
            <header className="auth-container-header">
                <div className="header-content">
                    <h1>Empowering Your Services</h1>
                    <p>Connect with customers seeking healthcare, education, and transportation services.</p>
                    <button onClick={() => navigate('/service_provider/register')} className="explore-button">Join Us Today</button>
                </div>
            </header>


            <section className="value-proposition">
                <h2>Our Value To Help You</h2>
                <div className="value-cards">
                    <div className="value-card">
                        <h3>Grow Your Business</h3>
                        <p>Reach a wider audience and grow your customer base.</p>
                    </div>
                    <div className="value-card">
                        <h3>Manage Your Services</h3>
                        <p>Easy management of your services and offerings.</p>
                    </div>
                    <div className="value-card">
                        <h3>Connect with Clients</h3>
                        <p>Interact with potential clients and provide excellent service.</p>
                    </div>
                </div>
            </section>
            <section>
                <h2>Return to consuming our service </h2>
                <button onClick={() => navigate('/')} className="return-button">Return</button>
            </section>

            <section className="get-started">
                <h2>Get Started with Us</h2>
                <p>Discover new opportunities for your services and get started today.</p>
                <button onClick={() => navigate('/service_provider/register')} className="get-started-button">Register Now</button>
                <div className="login-box">
                    <p>Already with us? <button onClick={() => navigate('/service_provider/login')} className="login-button">Login Here</button></p>
                </div>
            </section>
        </div>
    );
};

export default FancyLandingPage;
