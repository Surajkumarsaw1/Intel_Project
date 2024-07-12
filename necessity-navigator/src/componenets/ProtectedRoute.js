import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate('/');
        return null;
    }

    return children;
};

export default ProtectedRoute;
