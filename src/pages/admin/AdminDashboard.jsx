import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { Typography, Row, Col, Card, Statistic, Spin, Alert, Button } from 'antd';
import {
    DashboardOutlined,
    FundOutlined,
    UsergroupAddOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { API_URL } from '../../services/api';
import CreateCampaignModal from './CreateCampaignModal';
import UserManagementModal from './UserManagementModal';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Title, Paragraph } = Typography;

const AdminDashboard = () => {
    const [dashboardMetrics, setDashboardMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateCampaignModalVisible, setIsCreateCampaignModalVisible] = useState(false);
    const [isManageUsersModalVisible, setIsManageUsersModalVisible] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/admin/dashboard-metrics`, {
                    headers: getAuthHeaders()
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
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
            <div style={{ padding: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ color: 'maroon' }}>
                        Admin Dashboard
                    </Title>
                    <Paragraph>
                        Welcome to the Admin Dashboard. Get an overview of the system, monitor key metrics, and manage welfare operations.
                    </Paragraph>
                </div>

                {loading && <Spin tip="Loading Dashboard Metrics..." style={{ display: 'block', marginBottom: 24 }} />}
                {error && <Alert message={`Error fetching dashboard metrics: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                {dashboardMetrics && !loading && !error && (
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={6} key={0}>
                            <Card style={{ backgroundColor: '#f7f5f5', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Statistic
                                    title="Total Active Campaigns"
                                    value={dashboardMetrics.activeCampaignsCount}
                                    precision={0}
                                    prefix={<FundOutlined />}
                                    valueStyle={{ color: 'maroon', fontSize: '1.5rem' }}
                                    style={{ textAlign: 'center' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6} key={1}>
                            <Card style={{ backgroundColor: '#f7f5f5', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Statistic
                                    title="Pending Campaign Approvals"
                                    value={dashboardMetrics.pendingApprovalsCount}
                                    precision={0}
                                    prefix={<FileTextOutlined />}
                                    valueStyle={{ color: '#d46b08', fontSize: '1.5rem' }}
                                    style={{ textAlign: 'center' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6} key={2}>
                            <Card style={{ backgroundColor: '#f7f5f5', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Statistic
                                    title="Total System Members"
                                    value={dashboardMetrics.totalMembersCount}
                                    precision={0}
                                    prefix={<UsergroupAddOutlined />}
                                    valueStyle={{ color: '#389e0d', fontSize: '1.5rem' }}
                                    style={{ textAlign: 'center' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6} key={3}>
                            <Card style={{ backgroundColor: '#f7f5f5', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Statistic
                                    title="Total Funds Raised (All Campaigns)"
                                    value={dashboardMetrics.totalFundsRaised}
                                    precision={0}
                                    prefix={<DashboardOutlined />}
                                    valueStyle={{ color: '#08979c', fontSize: '1.5rem' }}
                                    style={{ textAlign: 'center' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                )}

                <div style={{ marginTop: '48px', borderTop: '2px solid #f0f0f0', paddingTop: '24px' }}>
                    <Title level={4} style={{ color: 'maroon' }}>
                        Quick Actions
                    </Title>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => setIsCreateCampaignModalVisible(true)}
                            >
                                <Card.Meta
                                    avatar={<FundOutlined style={{ fontSize: '24px', color: 'maroon' }} />}
                                    title="Create New Campaign"
                                    description="Initiate a new welfare campaign for students in need."
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => setIsManageUsersModalVisible(true)}
                            >
                                <Card.Meta
                                    avatar={<UsergroupAddOutlined style={{ fontSize: '24px', color: 'maroon' }} />}
                                    title="Manage Users"
                                    description="Add new student accounts or manage existing user access."
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => navigate('/admin/campaigns?tab=pending')} // Navigate to Campaign Management with tab parameter
                            >
                                <Card.Meta
                                    avatar={<FileTextOutlined style={{ fontSize: '24px', color: 'maroon' }} />}
                                    title="Review Pending Approvals"
                                    description="Process and manage pending campaign approval requests."
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Modals */}
                <CreateCampaignModal
                    visible={isCreateCampaignModalVisible}
                    onCancel={() => setIsCreateCampaignModalVisible(false)}
                    onCreated={() => {
                        setIsCreateCampaignModalVisible(false);
                        fetchDashboardData(); // Re-fetch dashboard data if needed
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