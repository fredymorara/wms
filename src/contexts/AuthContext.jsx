import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuthStatus = async () => {
        setIsLoading(true);
        const storedToken = localStorage.getItem('token');
        const storedUserData = JSON.parse(localStorage.getItem('user'));

        if (storedToken && storedUserData) {
            try {
                // api instance automatically sends the Bearer token from localStorage
                const response = await validateToken();
                if (response.valid || response.user) {
                    setUser(storedUserData);
                    setToken(storedToken);
                } else {
                    logout();
                }
            } catch (error) {
                console.error('AuthContext: Error validating token', error.message);
                logout();
            }
        } else {
            setUser(null);
            setToken(null);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkAuthStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = (userData, receivedToken) => {
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(receivedToken);
        // Interceptor will pick up the new token automatically on next request
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isLoading,
            checkAuthStatus // Export if needed to force refresh
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);