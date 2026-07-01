import { useState, useCallback } from 'react';
import { message } from 'antd';
import * as api from '../services/api';

export const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCampaigns = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.getAdminCampaigns();
            const data = result.data || result; // handle paginated response object
            setCampaigns(data);
            return data;
        } catch (err) {
            const errorMsg = err.message || 'Failed to fetch campaigns';
            setError(errorMsg);
            message.error(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const endCampaign = async (campaignId) => {
        setActionLoading(true);
        try {
            await api.endCampaign(campaignId);
            message.success(`Campaign ${campaignId} ended successfully`);
            await fetchCampaigns(); // Refresh data
        } catch (err) {
            const errorMsg = err.message || 'Failed to end campaign';
            setError(errorMsg);
            message.error(`Error ending campaign: ${errorMsg}`);
        } finally {
            setActionLoading(false);
        }
    };

    const approveCampaign = async (campaignId) => {
        setActionLoading(true);
        try {
            await api.approveCampaign(campaignId);
            message.success(`Campaign ${campaignId} approved successfully`);
            await fetchCampaigns(); // Refresh data
        } catch (err) {
            const errorMsg = err.message || 'Failed to approve campaign';
            setError(errorMsg);
            message.error(`Error approving campaign: ${errorMsg}`);
        } finally {
            setActionLoading(false);
        }
    };

    const rejectCampaign = async (campaignId, rejectionReason) => {
        setActionLoading(true);
        try {
            await api.rejectCampaign(campaignId, rejectionReason);
            message.success(`Campaign ${campaignId} rejected successfully`);
            await fetchCampaigns(); // Refresh data
        } catch (err) {
            const errorMsg = err.message || 'Failed to reject campaign';
            setError(errorMsg);
            message.error(`Error rejecting campaign: ${errorMsg}`);
        } finally {
            setActionLoading(false);
        }
    };

    return {
        campaigns,
        loading,
        actionLoading,
        error,
        setError,
        fetchCampaigns,
        endCampaign,
        approveCampaign,
        rejectCampaign,
    };
};
