import axios from 'axios';

// Use environment variable or fallback to localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor for uniform error handling
api.interceptors.response.use(
    (response) => response.data, // Return data directly for cleaner components
    (error) => {
        const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'An unexpected error occurred';
        console.error('API Error:', errorMsg);
        return Promise.reject(new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)));
    }
);

export default api;

// --- API Functions ---

// Auth
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const validateToken = () => api.get('/auth/validate-token');

// Member Profile
export const getMemberProfile = () => api.get('/member/profile');
export const updateMemberProfile = (fullName) => api.put('/member/profile/update', { fullName });
export const changeMemberPassword = (passwordData) => api.put('/member/profile/change-password', passwordData);

// Member Campaigns & Funds
export const getActiveCampaigns = () => api.get('/member/campaigns');
export const applyForCampaign = (campaignData) => api.post('/member/campaigns/apply', campaignData);
export const initiateMpesaPayment = (paymentData) => api.post('/member/mpesa-payment', paymentData);
export const getMyContributionHistory = () => api.get('/member/my-contributions');
export const getMyRecentActivity = () => api.get('/member/my-recent-activity');
export const submitHelpInquiry = (inquiryData) => api.post('/member/inquiry', inquiryData);

// Admin Dashboard & Reports
export const getFundsOverview = () => api.get('/admin/dashboard-metrics');
export const changeAdminPassword = (passwordData) => api.post('/admin/change-password', passwordData);

// Admin Campaigns
export const getAdminCampaigns = () => api.get('/admin/campaigns');
export const endCampaign = (campaignId) => api.post(`/admin/campaigns/${campaignId}/end`);
export const approveCampaign = (campaignId) => api.post(`/admin/campaigns/${campaignId}/approve`);
export const rejectCampaign = (campaignId, rejectionReason) => api.post(`/admin/campaigns/${campaignId}/reject`, { rejectionReason });
export const initiateCampaignDisbursement = (campaignId, disbursementData) => api.post(`/admin/campaigns/${campaignId}/initiate-disbursement`, disbursementData);

// Admin Funds
export const getCampaignContributors = (campaignId) => api.get(`/admin/campaign-contributors/${campaignId}`);
export const getCampaignContributionHistory = (campaignId) => api.get(`/admin/campaign-contribution-history/${campaignId}`);