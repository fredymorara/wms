import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spin } from 'antd'; // Import Spin from antd

const PrivateRoute = ({ allowedRoles }) => {
    const { user, isLoading } = useAuth();

    // Show a loading spinner while checking authentication
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large" tip="Checking authentication..." />
            </div>
        );
    }

    // Check if user exists and has allowed role
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user's role is in allowed roles
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/404" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;