import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faSchool, faClinicMedical } from '@fortawesome/free-solid-svg-icons';
import { useAuth0 } from "@auth0/auth0-react";

function Auth() {
    const navigate = useNavigate();
    const { loginWithRedirect } = useAuth0();
    const handleJoinUsClick = () => {
        navigate('/service_provider/auth');
    };

    return (
        <div className="auth-container">
            <div className="header">
                <h1>Changing your Service Experience</h1>
                <p>Discover the best service providers in your area</p>
            </div>
            <div className="main-content">
                <div className="left-section">
                    <img src="https://images.contentstack.io/v3/assets/bltf98232cd20baaf14/blt88389c7427a6acdf/62c399b024c5e237d46f33a7/Gallery_-_Meta_Image.jpg?width=1200&height=630&fit=crop" alt="Service Promotion" />
                </div>
                <div className="right-section">
                    <div className="get-started">
                        <h2>Get Started</h2>
                        <button onClick={() => loginWithRedirect()}>Log in</button>
                        <button onClick={() => loginWithRedirect({ screen_hint: 'signup' })}>Sign up</button>
                    </div>
                    <div className="join-us">
                        <h2>Want to enlist your services with us?</h2>
                        <button onClick={handleJoinUsClick}>Join Now</button>
                    </div>
                    <div className="services-info">
                        <p>     <FontAwesomeIcon icon={faHospital} /> Hospitals, <FontAwesomeIcon icon={faSchool} /> Schools, <FontAwesomeIcon icon={faClinicMedical} /> Clinics, and much more...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
