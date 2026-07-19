import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import DriverAuthContext from '../context/DriverAuthContext';

const DriverProtectWrapper = ({ children }) => {
    const { driver, loading } = useContext(DriverAuthContext);
    const token = localStorage.getItem('token');

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <p className="text-xl font-semibold text-gray-500 animate-pulse">Loading...</p>
            </div>
        );
    }

    if (!token && !driver) {
        return <Navigate to="/driverlogin" replace />;
    }

    return children;
};

export default DriverProtectWrapper;
