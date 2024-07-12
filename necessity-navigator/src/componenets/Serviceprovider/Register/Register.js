import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegistrationForm.css';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/provideraccounts/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.username ? data.username[0] : 'Registration failed');
            } else {
                navigate('/service_provider/service-selection');
                setError('');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred');
        }
    };

    return (
        <div className="registration-container">
            <form onSubmit={handleSubmit} className="registration-form">
                <h2>Register</h2>
                <div className="form-group">
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="register-button">Register</button>
                <p>Already joined with us? <Link to="/service_provider/login">Login</Link></p>
            </form>
        </div>
    );
};

export default RegistrationForm;
