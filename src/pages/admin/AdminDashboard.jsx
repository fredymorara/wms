import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { getFundsOverview } from '../../services/api';
import { Typography, Row, Col, Card, Statistic, Spin, Alert, Button } from 'antd';
import {
    DashboardOutlined,
    FundOutlined,
    UsergroupAddOutlined,
    FileTextOutlined,
    PlusOutlined,
    SettingOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import { API_URL } from '../../services/api';
import CreateCampaignModal from './CreateCampaignModal';
import UserManagementModal from './UserManagementModal';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const AdminDashboard = () => {
    const [dashboardMetrics, setDashboardMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateCampaignModalVisible, setIsCreateCampaignModalVisible] = useState(false);
    const [isManageUsersModalVisible, setIsManageUsersModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getFundsOverview();
                setDashboardMetrics(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <Title level={2} className="text-[#800000]! mb-0!">Admin Dashboard</Title>
                    <Paragraph className="text-zinc-500 max-w-2xl mx-auto">
                        Overview of the system, key metrics, and quick actions to manage welfare operations efficiently.
                    </Paragraph>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-48">
                        <Spin size="large" tip="Loading Dashboard Metrics..." />
                    </div>
                )}
                
                {error && <Alert message={`Error fetching metrics: ${error}`} type="error" closable onClose={() => setError(null)} />}

                {/* Metrics Grid */}
                {dashboardMetrics && !loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title={<Text className="text-zinc-500 font-medium">Active Campaigns</Text>}
                                value={dashboardMetrics.activeCampaignsCount}
                                precision={0}
                                prefix={<FundOutlined className="text-[#800000] mr-2" />}
                                valueStyle={{ fontSize: '2rem', fontWeight: 'bold', color: '#18181b' }}
                            />
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title={<Text className="text-zinc-500 font-medium">Pending Approvals</Text>}
                                value={dashboardMetrics.pendingApprovalsCount}
                                precision={0}
                                prefix={<FileTextOutlined className="text-[#d46b08] mr-2" />}
                                valueStyle={{ fontSize: '2rem', fontWeight: 'bold', color: '#18181b' }}
                            />
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title={<Text className="text-zinc-500 font-medium">Total Members</Text>}
                                value={dashboardMetrics.totalMembersCount}
                                precision={0}
                                prefix={<UsergroupAddOutlined className="text-[#389e0d] mr-2" />}
                                valueStyle={{ fontSize: '2rem', fontWeight: 'bold', color: '#18181b' }}
                            />
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title={<Text className="text-zinc-500 font-medium">Total Funds Raised</Text>}
                                value={dashboardMetrics.totalFundsRaised}
                                precision={0}
                                prefix={<span className="text-[#08979c] text-xl mr-2 font-bold">KES</span>}
                                valueStyle={{ fontSize: '2rem', fontWeight: 'bold', color: '#18181b' }}
                            />
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8 mt-12">
                    <div className="mb-6">
                        <Title level={4} className="text-[#800000]! mb-1!">Quick Actions</Title>
                        <Text className="text-zinc-500">Manage campaigns and users with one click.</Text>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div 
                            className="group p-6 rounded-2xl border border-zinc-200 hover:border-[#800000] hover:bg-[#800000]/5 cursor-pointer transition-all flex items-start gap-4"
                            onClick={() => setIsCreateCampaignModalVisible(true)}
                        >
                            <div className="w-12 h-12 rounded-full bg-[#800000]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <PlusOutlined className="text-[#800000] text-xl" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-[#800000]">Create Campaign</h4>
                                <p className="text-zinc-500 text-sm">Initiate a new welfare campaign for students in need.</p>
                            </div>
                        </div>

                        <div 
                            className="group p-6 rounded-2xl border border-zinc-200 hover:border-[#800000] hover:bg-[#800000]/5 cursor-pointer transition-all flex items-start gap-4"
                            onClick={() => setIsManageUsersModalVisible(true)}
                        >
                            <div className="w-12 h-12 rounded-full bg-[#800000]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <SettingOutlined className="text-[#800000] text-xl" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-[#800000]">Manage Users</h4>
                                <p className="text-zinc-500 text-sm">Add new student accounts or manage existing access.</p>
                            </div>
                        </div>

                        <div 
                            className="group p-6 rounded-2xl border border-zinc-200 hover:border-[#800000] hover:bg-[#800000]/5 cursor-pointer transition-all flex items-start gap-4"
                            onClick={() => navigate('/admin/campaigns?tab=pending')}
                        >
                            <div className="w-12 h-12 rounded-full bg-[#800000]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <UnorderedListOutlined className="text-[#800000] text-xl" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-[#800000]">Review Approvals</h4>
                                <p className="text-zinc-500 text-sm">Process and manage pending campaign requests.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <CreateCampaignModal
                    visible={isCreateCampaignModalVisible}
                    onCancel={() => setIsCreateCampaignModalVisible(false)}
                    onCreated={() => {
                        setIsCreateCampaignModalVisible(false);
                        // Trigger a reload or pass a refresh function if needed
                        window.location.reload(); 
                    }}
                />

                <UserManagementModal
                    visible={isManageUsersModalVisible}
                    onCancel={() => setIsManageUsersModalVisible(false)}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;