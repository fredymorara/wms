// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token')); // Initialize from localStorage
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Validate token function (same as before)
    const validateToken = async (tokenToValidate) => { // Renamed arg to avoid conflict
        try {
            const response = await axios.get(`${API_URL}/auth/validate-token`, {
                headers: { Authorization: `Bearer ${tokenToValidate}` }
            });
            return response.data.valid;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoading(true);
            const storedToken = localStorage.getItem('token');
            const storedUserData = JSON.parse(localStorage.getItem('user'));

            console.log('AuthContext checkAuthStatus - storedToken:', storedToken);

            if (storedToken && storedUserData) {
                try {
                    const isValidToken = await validateToken(storedToken);
                    console.log('AuthContext checkAuthStatus - isValidToken:', isValidToken);

                    if (isValidToken) {
                        setUser(storedUserData);
                        setToken(storedToken); // Set token state
                        console.log('AuthContext checkAuthStatus - Setting user and token state.');
                        // Update axios default header
                        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    } else {
                        console.log('AuthContext checkAuthStatus - Token invalid, logging out.');
                        logout();
                    }
                } catch (error) {
                    console.error('AuthContext checkAuthStatus - Error validating token:', error);
                    logout();
                }
            } else {
                console.log('AuthContext checkAuthStatus - No token/user found in localStorage.');
                setUser(null);
                setToken(null); // Clear token state
                delete axios.defaults.headers.common['Authorization'];
            }
            setIsLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = (userData, receivedToken) => { // Renamed arg
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(receivedToken); // Set token state
        // Update axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
        console.log('AuthContext login - User and token set.');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null); // Clear token state
        // Remove axios default header
        delete axios.defaults.headers.common['Authorization'];
        console.log('AuthContext logout - User and token cleared.');
        navigate('/login'); // Navigate after clearing state
    };

    // Remove the axios interceptor useEffect block if setting default header,
    // or keep it if you prefer interceptors over default headers.
    // Setting default header is often simpler if the token doesn't change frequently mid-session.

    return (
        <AuthContext.Provider value={{
            user,
            token, // Provide token state
            login,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);