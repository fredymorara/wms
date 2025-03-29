import axios from 'axios';

export const API_URL = 'https://kabu-welfare-backend.onrender.com'

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

// initiateMpesaPayment with this:
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

// ADD THIS FUNCTION for Member Password Change
export const changeMemberPassword = async (passwordData, token) => {
    try {
        const response = await axios.put(
            `${API_URL}/member/profile/change-password`,
            passwordData, // { currentPassword, newPassword }
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data; // { message: "Password updated successfully." }
    } catch (error) {
        console.error("Change Member Password API error:", error.response?.data || error.message);
        throw error.response?.data || { message: 'Network error or password change failed.' };
    }
};

// ADD THIS FUNCTION for Admin Password Change
export const changeAdminPassword = async (passwordData, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/admin/change-password`,
            passwordData, // { currentPassword, newPassword }
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data; // { message: "Admin password changed successfully." }
    } catch (error) {
        console.error("Change Admin Password API error:", error.response?.data || error.message);
        throw error.response?.data || { message: 'Network error or password change failed.' };
    }
};

// --- NEW Function: Initiate Campaign Disbursement (Admin) ---
export const initiateCampaignDisbursement = async (campaignId, disbursementData) => {
    // disbursementData should contain { recipientPhone, amount, recipientName?, remarks? }
    try {
        // Retrieve token from localStorage or context if not using Axios interceptor
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        // Make sure API_URL is correctly defined/imported
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Or your actual API base URL

        const response = await axios.post(
            `${API_URL}/admin/campaigns/${campaignId}/initiate-disbursement`,
            disbursementData,
            config // Pass config with headers
        );
        return response.data; // Contains { message, conversationId, campaignStatus, disbursementStatus }
    } catch (error) {
        console.error('Error initiating campaign disbursement:', error.response?.data || error.message);
        // Rethrow a more specific error message if available
        throw new Error(error.response?.data?.message || error.message || 'Failed to initiate disbursement');
    }
};