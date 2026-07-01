import { useState, useCallback } from 'react';
import { message } from 'antd';
import * as api from '../services/api';

export const useFunds = () => {
    const [campaignFundsData, setCampaignFundsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCampaignFundsData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getAdminCampaigns(); // Assumes this gets the campaigns with fund info
            setCampaignFundsData(Array.isArray(data) ? data : []);
            return data;
        } catch (err) {
            const errorMsg = err.message || 'Failed to fetch campaign funds data';
            setError(errorMsg);
            message.error(`Error fetching data: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchContributors = async (campaignId) => {
        setModalLoading(true);
        setError(null);
        try {
            const data = await api.getCampaignContributors(campaignId);
            return Array.isArray(data) ? data : [];
        } catch (err) {
            const errorMsg = err.message || 'Failed to load contributors';
            setError(errorMsg);
            message.error(errorMsg);
            return [];
        } finally {
            setModalLoading(false);
        }
    };

    const fetchContributionHistory = async (campaignId) => {
        setModalLoading(true);
        setError(null);
        try {
            const data = await api.getCampaignContributionHistory(campaignId);
            return Array.isArray(data) ? data : [];
        } catch (err) {
            const errorMsg = err.message || 'Failed to load contribution history';
            setError(errorMsg);
            message.error(errorMsg);
            return [];
        } finally {
            setModalLoading(false);
        }
    };

    const disburseFunds = async (campaignId, disbursementData) => {
        setActionLoading(true);
        try {
            const response = await api.initiateCampaignDisbursement(campaignId, disbursementData);
            message.success(response.message || 'Disbursement initiated successfully!');
            await fetchCampaignFundsData(); // Refresh data
            return true;
        } catch (err) {
            const errorMsg = err.message || 'Failed to initiate disbursement';
            message.error(errorMsg);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    return {
        campaignFundsData,
        loading,
        actionLoading,
        modalLoading,
        error,
        setError,
        fetchCampaignFundsData,
        fetchContributors,
        fetchContributionHistory,
        disburseFunds
    };
};
