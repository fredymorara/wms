import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { Typography, Row, Col, Card, Statistic, Spin, Alert } from 'antd';
import {
    DashboardOutlined,
    FundOutlined,
    UsergroupAddOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { API_URL } from '../../services/api';

const { Title, Paragraph } = Typography;

const AdminDashboard = () => {
    const [dashboardMetrics, setDashboardMetrics] = useState(null); // State to hold metrics from API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAuthHeaders = () => { // Helper function to get auth headers
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
                const response = await fetch(`${API_URL}/admin/dashboard-metrics`, { // Fetch from API endpoint
                    headers: getAuthHeaders() // Include token
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDashboardMetrics(data); // **Set dashboardMetrics state with API data**
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

                {dashboardMetrics && !loading && !error && ( // **Conditional rendering - only show metrics if data is loaded and no error**
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={6} key={0}>
                            <Card style={{ backgroundColor: '#f7f5f5', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Statistic
                                    title="Total Active Campaigns"
                                    value={dashboardMetrics.activeCampaignsCount} // <-- **Use data from dashboardMetrics**
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
                                    value={dashboardMetrics.pendingApprovalsCount} // <-- **Use data from dashboardMetrics**
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
                                    value={dashboardMetrics.totalMembersCount} // <-- **Use data from dashboardMetrics**
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
                                    value={dashboardMetrics.totalFundsRaised} // <-- **Use data from dashboardMetrics**
                                    precision={0}
                                    prefix={<DashboardOutlined />} // Consider a more financial icon
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
                                onClick={() => { /* Implement action - e.g., navigate to campaign creation page */ console.log('Create New Campaign Clicked'); }}
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
                                onClick={() => { /* Implement action - e.g., navigate to user management page */ console.log('Manage Users Clicked'); }}
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
                                onClick={() => { /* Implement action - e.g., navigate to pending approvals page */ console.log('Review Pending Approvals Clicked'); }}
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

                {/* Add more dashboard sections as needed - e.g., Recent Activities, Charts, etc. */}

            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;