import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Statistic, Row, Col, Alert, Spin, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined, FundOutlined, OrderedListOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function SecretaryDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/secretary/dashboard');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDashboardData(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const defaultDashboardData = {
        pendingCampaignRequests: 5,
        activeCampaigns: 8,
        totalFundsRaised: 650000,
        recentActivity: [
            'New campaign request: Medical Assistance for Student C',
            'Campaign "Education Support for Student D" nearing end date',
            'Disbursement request approved for campaign "Emergency Fund for Student E"',
        ],
    };

    return (
        <Layout
            style={{
                background: 'linear-gradient(to bottom, #F8E8EC 70%, #d9f7be)',
                minHeight: '100vh',
            }}
        >
            <Header
                style={{
                    background: 'maroon',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '0 50px',
                    height: '80px',
                }}
            >
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    Kabarak Student Welfare Management System - Secretary Dashboard
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Secretary Dashboard</Title>

                    {loading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading dashboard data...</p>
                        </div>
                    ) : error ? (
                        <Alert message={`Error fetching data: ${error}. Displaying default data.`} type="error" showIcon />
                    ) : null}

                    {/* Key Metrics */}
                    <Row gutter={[24, 24]} style={{ marginBottom: '20px' }}>
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <Statistic
                                    title="Pending Campaign Requests"
                                    value={loading || error ? defaultDashboardData.pendingCampaignRequests : dashboardData.pendingCampaignRequests}
                                    prefix={<ExclamationCircleOutlined />}
                                    suffix=" requests"
                                />
                                <Button type="primary" style={{ marginTop: '10px', backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                                    <Link to="/secretary/campaign-requests">Review Requests</Link>
                                </Button>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <Statistic
                                    title="Active Campaigns"
                                    value={loading || error ? defaultDashboardData.activeCampaigns : dashboardData.activeCampaigns}
                                    prefix={<FundOutlined />}
                                    suffix=" campaigns"
                                />
                                <Button type="primary" style={{ marginTop: '10px', backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                                    <Link to="/secretary/campaigns">Manage Campaigns</Link>
                                </Button>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card>
                                <Statistic
                                    title="Total Funds Raised (KES)"
                                    value={loading || error ? defaultDashboardData.totalFundsRaised : dashboardData.totalFundsRaised}
                                    prefix="KES"
                                    precision={2}
                                    groupSeparator=","
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Recent Activity */}
                    <Card title="Recent Activity">
                        <ul>
                            {(loading || error ? defaultDashboardData.recentActivity : dashboardData.recentActivity).map((activity, index) => (
                                <li key={index} style={{ marginBottom: '5px' }}>
                                    {activity}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
}

export default SecretaryDashboardPage;