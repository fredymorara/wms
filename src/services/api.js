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
        throw new Error(error.response?.data?.message || 'Login failed ... Network error or server is down. ');
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

// Update member profile
export const updateMemberProfile = async (fullName, token) => {
    console.log("updateMemberProfile API function called with fullName:", fullName, "and token:", token); // <--- ADD THIS LOG (START)
    try {
        const response = await axios.put(
            `${API_URL}/member/profile/update`,
            { fullName },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log("updateMemberProfile API function response:", response); // <--- ADD THIS LOG (SUCCESS)
        return response.data;
    } catch (error) {
        console.error("updateMemberProfile API function error:", error); // Keep error log
        throw error.response ? error.response.data : { message: 'Network error or profile update failed.' };
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

export const getFundsOverview = async () => {
    return axios.get(`${API_URL}/admin/dashboard-metrics`);
};

// In api.js - temporarily replace initiateMpesaPayment with this:
export const initiateMpesaPayment = async (paymentData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/member/mpesa-payment`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });
        if (!response.ok) {
            const errorText = await response.text(); // Get error text from response
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch API Error initiating M-Pesa payment:", error);
        return { message: 'Payment initiation failed', error: error.message };
    }
};