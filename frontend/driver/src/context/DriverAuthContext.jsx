import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const DriverAuthContext = createContext();

export const DriverAuthProvider = ({ children }) => {
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDriverProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/drivers/profile');
                if (response.data && response.data.driver) {
                    setDriver(response.data.driver);
                }
            } catch (error) {
                console.error("Error fetching driver profile:", error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        fetchDriverProfile();
    }, []);

    return (
        <DriverAuthContext.Provider
            value={{
                driver,
                setDriver,
                loading,
                setLoading
            }}
        >
            {children}
        </DriverAuthContext.Provider>
    );
};

export default DriverAuthContext;