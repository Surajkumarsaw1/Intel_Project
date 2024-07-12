import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/provideraccounts/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.non_field_errors ? data.non_field_errors[0] : 'Login failed');
            } else {
                const data = await response.json();
                localStorage.setItem('token', data.key);
                navigate('/service_provider/dashboard');
                setError('');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <div className="form-group">
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Login</button>
                <p>Dont have an id? <Link to='/service_provider/register'>Registerhere</Link></p>
            </form>
        </div>
    );
};

export default LoginForm;
