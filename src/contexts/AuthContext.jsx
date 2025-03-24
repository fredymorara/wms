import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api'; // Adjust path as needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Validate token on app load
    const validateToken = async (token) => {
        try {
            const response = await axios.get(`${API_URL}/auth/validate-token`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.valid;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('user'));

            if (token && userData) {
                try {
                    const isValidToken = await validateToken(token);

                    if (isValidToken) {
                        setUser(userData);
                    } else {
                        // Token is invalid, logout
                        logout();
                    }
                } catch (error) {
                    logout();
                }
            }

            setIsLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // Add token interceptor
    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);