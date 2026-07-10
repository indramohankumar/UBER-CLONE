import React, { createContext, useState, useEffect } from 'react';
import api from "../services/api";
export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
            return;
        }
        
        const fetchUser = async () => {
            try {
                const { data } = await api.get("/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(data.user); 
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                localStorage.removeItem('token'); 
                setUser(null);
            }
        };

        fetchUser(); // We must actually call the function!
    }, []);
   return (
    <AuthContext.Provider value={{ user, setUser }}>
        {children}
    </AuthContext.Provider>
);
};
export default AuthProvider;