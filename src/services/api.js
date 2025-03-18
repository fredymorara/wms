import axios from 'axios';

export const API_URL = 'http://localhost:5000'; // Replace with your backend URL

// Register a new user
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network error or server is down.' };
    }
};


export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data; // Return { user, token }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

// Fetch member profile
export const getMemberProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/member/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Fetch active campaigns
export const getActiveCampaigns = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/member/campaigns`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

